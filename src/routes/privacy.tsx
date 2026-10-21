import { createFileRoute } from "@tanstack/react-router";
import { LegalList, LegalPage } from "@/shared/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy · UniHub" },
      {
        name: "description",
        content:
          "What UniHub collects from students and landlords, why, who can see it, and how to have it removed.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="1 October 2026"
      summary="Students can browse UniHub without an account. Landlords give us enough detail to be verified. We do not sell anyone's data, and your ID number is never shown to students."
      related={{ to: "/terms", label: "Terms of service" }}
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>
                When you browse, we do not ask for an account, a phone number, or an email address.
              </p>
              <p>When you register as a landlord, we collect:</p>
              <LegalList
                items={[
                  "Your name, email, phone and WhatsApp numbers",
                  "Your national ID number, used only to confirm you are who you say you are",
                  "The campuses you intend to serve and how many properties you expect to list",
                  "Any note you add when applying, and your consent record (date and policy version)",
                  "The listings you publish, including photos, rent, location and amenities",
                ]}
              />
              <p>
                We also keep basic technical logs from our hosting provider, such as the time of a
                request and errors, so we can keep the service running.
              </p>
            </>
          ),
        },
        {
          heading: "What students see",
          body: (
            <>
              <p>
                A published listing shows the property details and the contact channel the landlord
                chose. It never shows a landlord's ID number, personal email or application notes.
              </p>
              <p>
                When you tap WhatsApp or email on a listing, the conversation happens in that app
                under its own privacy terms. UniHub does not receive a copy of those messages.
              </p>
            </>
          ),
        },
        {
          heading: "Why we hold it",
          body: (
            <LegalList
              items={[
                "To verify landlords before their listings go live, and to review reports about them",
                "To show accurate listings and let students reach the right person",
                "To answer support requests and investigate suspected fraud",
                "To meet record-keeping duties that apply to us under Kenyan law",
              ]}
            />
          ),
        },
        {
          heading: "Who can access it",
          body: (
            <>
              <p>
                Landlord profiles are readable only by the landlord who owns them and by UniHub
                reviewers. Admin access is role-based and limited to people who vet landlords or
                moderate listings.
              </p>
              <p>
                We use Google Firebase for authentication and database storage, and our site is
                served by a hosting provider. These providers process data on our instructions; they
                do not get to use it for their own marketing.
              </p>
              <p>
                We do not sell personal data, and we do not run third-party ad tracking on UniHub.
              </p>
            </>
          ),
        },
        {
          heading: "How long we keep it",
          body: (
            <p>
              Landlord profiles and listings stay while the account is active. If you ask us to
              delete an account, we remove the profile and unpublish its listings; we may keep a
              minimal record of a verification decision where the law or an open dispute requires
              it.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <>
              <p>
                You can ask to see, correct or delete the data tied to your landlord account, or
                withdraw consent for us to hold it, by messaging{" "}
                <a
                  href="mailto:hello@unihub.ke"
                  className="text-foreground underline underline-offset-4"
                >
                  hello@unihub.ke
                </a>
                . We reply within five working days and may ask you to confirm you control the
                account.
              </p>
              <p>
                Withdrawing consent means we can no longer verify you, so your listings would come
                down.
              </p>
            </>
          ),
        },
        {
          heading: "Security and age",
          body: (
            <>
              <p>
                Access to the database requires an authenticated account, and reviewer tools are
                restricted by role. No system is perfectly secure: if we ever find that data was
                exposed, we will tell affected landlords directly.
              </p>
              <p>
                UniHub is built for university students. If you are under 18, involve a parent or
                guardian before you pay any deposit.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
