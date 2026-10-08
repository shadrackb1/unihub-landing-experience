#!/usr/bin/env python3
"""
Script to install 200+ trending Hermes skills using search queries for popular topics.
"""
import subprocess
import time

def run_cmd(cmd):
    """Run a command and return output."""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    return result

def search_and_install(query, max_results=10):
    """Search for skills and install them."""
    print(f"\nSearching for: {query}")
    cmd = f"hermes skills search {query}"
    result = run_cmd(cmd)
    
    # Parse the search results table to get identifiers
    skills = []
    lines = result.stdout.split('\n')
    in_table = False
    for line in lines:
        if '┌' in line and 'Name' in line:
            in_table = True
            continue
        if '└' in line:
            in_table = False
            continue
        if in_table and '│' in line and not line.startswith('├') and not 'Name' in line:
            parts = [p.strip() for p in line.split('│')]
            if len(parts) >= 5:
                identifier = parts[4].strip()
                # Clean up ANSI codes
                identifier = identifier.replace('\x1b', '').strip()
                if identifier and identifier != 'Identifier' and not identifier.startswith('official/') and '/' in identifier:
                    skills.append(identifier)
    
    print(f"Found {len(skills)} skills for '{query}'")
    
    installed = 0
    for i, skill in enumerate(skills[:max_results], 1):
        print(f"  [{i}/{min(len(skills), max_results)}] Installing: {skill}")
        cmd = f"hermes skills install {skill} --yes"
        result = run_cmd(cmd)
        if result.returncode == 0:
            installed += 1
            print(f"    ✓ Success")
        else:
            print(f"    ✗ Failed")
        time.sleep(0.5)
    
    return installed

def main():
    print("=" * 60)
    print("Installing 200+ Trending Hermes Skills via Search")
    print("=" * 60)
    
    # Popular search queries for trending skills
    search_queries = [
        "mcp",
        "agent",
        "llm",
        "rag",
        "fine-tuning",
        "vllm",
        "langchain",
        "langgraph",
        "autogen",
        "crewai",
        "ollama",
        "huggingface",
        "transformers",
        "pytorch",
        "tensorrt",
        "onnx",
        "docker",
        "kubernetes",
        "terraform",
        "ansible",
        "aws",
        "gcp",
        "azure",
        "github",
        "gitlab",
        "ci-cd",
        "monitoring",
        "logging",
        "observability",
        "prometheus",
        "grafana",
        "elasticsearch",
        "redis",
        "postgresql",
        "mongodb",
        "kafka",
        "rabbitmq",
        "nginx",
        "traefik",
        "cert-manager",
        "istio",
        "linkerd",
        "argocd",
        "flux",
        "helm",
        "kustomize",
        "prometheus-operator",
        "thanos",
        "loki",
        "tempo",
        "pyroscope",
        "jaeger",
        "zipkin",
        "opentelemetry",
        "vector",
        "fluentd",
        "fluent-bit",
        "filebeat",
        "metricbeat",
        "packetbeat",
        "auditbeat",
        "heartbeat",
        "neuron",
        "torchserve",
        "triton",
        "bentoml",
        "mlflow",
        "kubeflow",
        "airflow",
        "prefect",
        "dagster",
        "dbt",
        "great-expectations",
        "evidently",
        "whylogs",
        "feast",
        "tecton",
        "hopsworks",
        "zenml",
        "mlrun",
        "clearml",
        "wandb",
        "neptune",
        "comet",
        "dvclive",
        "aim",
        "tensorboard",
        "gradio",
        "streamlit",
        "panel",
        "dash",
        "voila",
        "panel",
        "solara",
        "reflex",
        "mesop",
        "nicegui",
        "flet",
        "pyscript",
        "starlite",
        "fastapi",
        "starlette",
        "quart",
        "sanic",
        "aiohttp",
        "httpx",
        "requests",
        "urllib3",
        "aiofiles",
        "pydantic",
        "pydantic-settings",
        "pydantic-extra-types",
        "sqlalchemy",
        "alembic",
        "tortoise-orm",
        "prisma",
        "edgeDB",
        "surrealDB",
        "redis-om",
        "arq",
        "dramatiq",
        "celery",
        "rq",
        "huey",
        "apscheduler",
        "schedule",
        "croniter",
        "python-crontab",
        "apscheduler",
        "watchgod",
        "watchfiles",
        "inotify",
        "pyinotify",
        "watchdog",
        "fsmonitor",
    ]
    
    total_installed = 0
    
    for query in search_queries:
        installed = search_and_install(query, max_results=5)
        total_installed += installed
        print(f"Total installed so far: {total_installed}")
        if total_installed >= 200:
            break
        time.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"Installation complete!")
    print(f"Total skills installed: {total_installed}")
    print("=" * 60)

if __name__ == "__main__":
    main()