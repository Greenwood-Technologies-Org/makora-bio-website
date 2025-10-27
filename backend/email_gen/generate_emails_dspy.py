import requests
import json


def main():
  response = requests.post(
      "http://localhost:5001/api/dspy/draft-synthetic-email-threads",
      json={
          "study_overview": """
            Brief Summary

            This is a Phase 1/2, multicenter, randomized, placebo-controlled, double-blind study to evaluate the safety, tolerability, pharmacokinetics (PK), and pharmacodynamics (PD) of single and multiple doses of DNL593 in two parts followed by an optional open-label extension (OLE) period.

            Part A will evaluate the safety, tolerability, PK, and PD of single doses of DNL593 in healthy male and healthy female participants of nonchildbearing potential. Part B will evaluate the safety, tolerability, PK, and PD of multiple doses of DNL593 in participants with frontotemporal dementia (FTD) over 25 weeks. Part B will be followed by Part C, an optional 18-month OLE period available for all participants who complete Part B.
            Official Title
            A Phase 1/2, Multicenter, Randomized, Placebo-Controlled, Double Blind Single Dose and Multiple Dose Study to Evaluate the Safety, Tolerability, Pharmacokinetics, and Pharmacodynamics of DNL593 in Healthy Participants and Participants With Frontotemporal Dementia Followed by an Open-Label Extension
            Conditions
            Frontotemporal Dementia
            Intervention / Treatment

                Drug: DNL593
                Drug: Placebo

            Other Study ID Numbers

                DNLI-H-0001
                2023-508697-28-00 ( EU Trial (CTIS) Number )
                2021-005733-16 ( EudraCT Number )
          """,
          "role": "CRA",
          "num_threads": 1
      }
  )

  print("response:")
  print(response.json())
  print("--------------------------------")
  # save the email thread to a file
  with open("email_thread.json", "a") as f:
    json.dump(response.json(), f)


if __name__ == "__main__":
  main()