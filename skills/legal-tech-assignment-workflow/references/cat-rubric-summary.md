# CAT 1/2/3 Rubric Summary — KLS 126

## Mark Allocation

| Assignment | Title | Points | Deadline |
|---|---|---|---|
| CAT 1 | Application development (upload from GitHub) | 15 | 21st October 2026 |
| CAT 2 | Consent form (PDF) | 10 | 21st October 2026 |
| CAT 3 | Data Protection Impact Assessment (PDF) | 15 | 21st October 2026 |
| **Total CAT** | | **40** | |
| End-of-semester exam | | 60 | — |
| **Overall pass mark** | | **40%** | |

## CAT 1: Application Development (15 marks)

### What the application must do
- Solve a real Kenyan legal use case (limitation periods, case files, or public judgments)
- Clear user group, inputs, outputs and tests
- Proper data layer with data dictionary, validated forms, import AND export
- At least two roles (e.g. admin and viewer) with genuinely different access
- Lawful data source with extraction, search, filters and dashboard
- If regex extraction used: test it and report accuracy (precision/recall)
- Tested against pre-publication checklist

### What to submit
- One ZIP file of application software downloaded from GitHub (must include `docs/` folder)
- GitHub repository link in private comment

### Before you submit, check
- ZIP contains latest code and the `docs/` folder
- Repository link works for the lecturer
- Group has tested every feature in requirements
- Prompt log is complete and dated
- Group has disclosed all AI use
- No secrets and no real personal data in repository

### File naming: `Group_Number_CAT_Application.zip`

---

## CAT 2: Consent Form (10 marks)

### What the consent form must do
- Identify data controller and any data processor, with working contact for rights requests and complaints
- State each purpose separately and specifically; say what the lawful basis is. Use consent only where it is the right basis, and explain why
- Tell the person what data is collected and why, who receives it, whether transferred abroad, how long kept, whether automated decisions made, right to withdraw consent, consequences of giving or refusing consent
- Make consent freely given: unticked boxes, no bundling of purposes, no detriment for refusing, simple way to withdraw. Record consent with date and time
- Use plain, accessible language. Deal correctly with sensitive data and children's data, or state application excludes them
- Work inside the application: consent screen/form must exist in the code uploaded in Assignment 1 and must record the consent

### What to submit
- One PDF of consent form, maximum [2] pages. Save/export from Google Docs or Word (File → Download → PDF). Do not upload Word or Docs file.
- PDF should include two or three screenshots at the end, showing the consent screen and stored record of consent in application (using synthetic data)
- PDF should have a cover page with group members' names, registration numbers, and signatures

### File naming: `GroupNumber_CAT2_Consent.pdf`

---

## CAT 3: DPIA (15 marks)

### What the DPIA must cover
1. **Description of the processing**: the data, its sources, the purposes, who uses it, how the data moves, and how long it is kept
2. **Necessity, proportionality and lawful basis**: justify each data field and each purpose, show how you minimise data, and state the lawful basis for each activity
3. **Risk identification and assessment**: identify realistic risks to the people whose data is in the records. Rate each by likelihood and severity. Consider sensitive data and automated decisions
4. **Safeguards and mitigation**: for each risk, give a specific measure (access control, security, minimisation, retention, handling of data subject rights, breach response). Show what you actually built into the application
5. **Hosting, processors and transfers**: say where the data is stored and who the processors are (e.g. Lovable, GitHub, Supabase). Assess the transfer route if data leaves Kenya, and the processor contract or terms
6. **Legal accuracy and citation**: use the Act, the Regulations and any cases correctly and cite them accurately
7. **Conclusion and residual risk**: state the residual risk, whether the Data Commissioner would need to be consulted, and when the DPIA will be reviewed

### What to submit
- One PDF of group's DPIA, using the prescribed template, with a list of the sources and authorities cited at the end. Save/export from Google Docs or Word (File → Download → PDF). Do not upload Word or Docs file.
- PDF should have a cover page with group members' names, registration numbers, and signatures

### File naming: `GroupNumber_CAT3_DPIA.pdf`

---

## Data Rules
- Use public or synthetic data only. Test your application with made-up names and numbers.
- Do not put real client information into Lovable, GitHub or any other tool.

## Before You Submit
- The ZIP contains the latest code and the `docs/` folder
- The repository link works for the lecturer
- The group has tested every feature in my requirements
- The prompt log is complete and dated
- The group has disclosed all AI use
- There are no secrets and no real personal data in the repository