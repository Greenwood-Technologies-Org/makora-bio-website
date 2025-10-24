import React from 'react';

export const studyProtocolContent = (
  <div>
    <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">CLINICAL STUDY PROTOCOL</h1>
      <p className="text-xl text-gray-700 mb-1">Study Number: XYZ-123-2025</p>
      <p className="text-lg text-gray-600">Phase III Randomized, Double-Blind, Placebo-Controlled Study</p>
      <p className="text-md text-gray-500 mt-4">Protocol Version 2.3 | Date: October 15, 2025</p>
    </div>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">1. STUDY SYNOPSIS</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Study Title:</h3>
          <p className="text-gray-700">A Phase III, Multicenter, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Efficacy and Safety of Investigational Drug XYZ in Patients with Advanced Condition</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Study Objectives:</h3>
          <p className="text-gray-700"><strong>Primary:</strong> To evaluate the efficacy of XYZ compared to placebo in improving patient outcomes at 24 weeks.</p>
          <p className="text-gray-700 mt-2"><strong>Secondary:</strong> To assess the safety and tolerability of XYZ in the study population.</p>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">2. STUDY DESIGN</h2>
      <p className="text-gray-700 mb-3">This is a phase III, multicenter, randomized, double-blind, placebo-controlled study. Approximately 300 patients will be randomized in a 2:1 ratio to receive either:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
        <li>Investigational Drug XYZ 100mg daily (n=200)</li>
        <li>Placebo (n=100)</li>
      </ul>
      <p className="text-gray-700 mt-3">Treatment duration: 24 weeks, with a 4-week follow-up period.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">3. PATIENT POPULATION</h2>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Inclusion Criteria:</h3>
          <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
            <li>Age ≥ 18 and ≤ 75 years</li>
            <li>Confirmed diagnosis of target condition for at least 6 months</li>
            <li>ECOG performance status 0-2</li>
            <li>Adequate organ function as defined by laboratory parameters</li>
            <li>Willing and able to provide written informed consent</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Exclusion Criteria:</h3>
          <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
            <li>Previous treatment with XYZ or similar investigational agents</li>
            <li>Significant cardiovascular disease within 6 months</li>
            <li>Active infection requiring systemic therapy</li>
            <li>Pregnant or nursing women</li>
            <li>Known hypersensitivity to study drug components</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">4. STUDY PROCEDURES</h2>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Screening Period (Days -28 to -1):</h3>
          <p className="text-gray-700">Medical history, physical examination, vital signs, ECG, laboratory assessments, eligibility confirmation</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Treatment Period (Week 0-24):</h3>
          <p className="text-gray-700">Monthly visits for safety assessments, efficacy evaluations, and study drug dispensing</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Follow-up Period (Week 24-28):</h3>
          <p className="text-gray-700">Final safety and efficacy assessments</p>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">5. SAFETY MONITORING</h2>
      <p className="text-gray-700 mb-3">All adverse events (AEs) will be monitored from the time of informed consent through the follow-up visit. Serious adverse events (SAEs) must be reported within 24 hours of awareness.</p>
      <p className="text-gray-700">An independent Data Safety Monitoring Board (DSMB) will conduct periodic safety reviews.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">6. STATISTICAL CONSIDERATIONS</h2>
      <p className="text-gray-700 mb-3"><strong>Sample Size:</strong> 300 patients (200 treatment, 100 placebo) to provide 90% power to detect a 15% difference in primary endpoint at α=0.05.</p>
      <p className="text-gray-700"><strong>Analysis:</strong> Intent-to-treat (ITT) population will be the primary analysis population. Per-protocol analysis will be conducted as sensitivity analysis.</p>
    </section>

    <div className="mt-8 pt-6 border-t-2 border-gray-300">
      <p className="text-sm text-gray-600 text-center">
        <strong>Confidential</strong> - This document contains proprietary information. Distribution is limited to authorized personnel only.
      </p>
    </div>
  </div>
);

export const informedConsentContent = (
  <div>
    <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">INFORMED CONSENT FORM</h1>
      <p className="text-xl text-gray-700 mb-1">Study XYZ-123-2025</p>
      <p className="text-lg text-gray-600">Phase III Clinical Trial</p>
      <p className="text-md text-gray-500 mt-4">Version 2.0 | Effective Date: October 1, 2025</p>
    </div>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">INTRODUCTION</h2>
      <p className="text-gray-700 mb-3">You are being asked to participate in a research study. This form provides important information about that study, including the risks and benefits to you as a potential participant.</p>
      <p className="text-gray-700 mb-3">Please read this form carefully and ask the study doctor or study staff any questions you may have about the study. You may take this form home to discuss with family or friends before deciding whether to participate.</p>
      <p className="text-gray-700 font-semibold">Your participation in this study is completely voluntary.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">WHY IS THIS STUDY BEING DONE?</h2>
      <p className="text-gray-700 mb-3">This research study is being conducted to evaluate whether an investigational drug called XYZ is safe and effective in treating patients with your condition.</p>
      <p className="text-gray-700 mb-3">An investigational drug is one that is not approved by the Food and Drug Administration (FDA) for sale in the United States. XYZ has been studied in earlier trials and has shown promising results.</p>
      <p className="text-gray-700">Approximately 300 people will participate in this study at about 25 medical centers in the United States.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">WHAT WILL HAPPEN IF I TAKE PART?</h2>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Screening Phase (about 4 weeks):</h3>
          <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
            <li>Review of your medical history</li>
            <li>Physical examination and vital signs</li>
            <li>Blood and urine tests</li>
            <li>Electrocardiogram (ECG) to check your heart</li>
            <li>Pregnancy test (if applicable)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Treatment Phase (24 weeks):</h3>
          <p className="text-gray-700 mb-2">If you qualify, you will be randomly assigned (like flipping a coin) to receive either:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
            <li>XYZ 100mg once daily (2 out of 3 chance), OR</li>
            <li>Placebo (inactive pill) once daily (1 out of 3 chance)</li>
          </ul>
          <p className="text-gray-700 mt-2">Neither you nor your study doctor will know which treatment you are receiving.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Study Visits:</h3>
          <p className="text-gray-700">You will visit the clinic monthly (about every 4 weeks) for safety checks and assessments. Each visit will take approximately 2-3 hours.</p>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">WHAT ARE THE RISKS?</h2>
      <p className="text-gray-700 mb-3">As with any medication, there are possible side effects. Based on previous studies, the most common side effects of XYZ include:</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
        <h3 className="font-semibold text-gray-900 mb-2">Common Side Effects (may affect more than 1 in 10 people):</h3>
        <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
          <li>Nausea and upset stomach</li>
          <li>Headache</li>
          <li>Fatigue or tiredness</li>
          <li>Dizziness</li>
        </ul>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Serious Side Effects (rare but possible):</h3>
        <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
          <li>Allergic reactions</li>
          <li>Changes in liver function</li>
          <li>Changes in heart rhythm</li>
        </ul>
      </div>
      <p className="text-gray-700 mt-3">There may be other risks that are currently unknown. You will be informed of any new information that may affect your willingness to continue in the study.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">WHAT ARE THE BENEFITS?</h2>
      <p className="text-gray-700 mb-3">You may or may not benefit directly from participating in this study. Possible benefits include improvement in your condition if you receive the active drug.</p>
      <p className="text-gray-700">Even if you do not benefit directly, the information learned from this study may help other people with your condition in the future.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">CONFIDENTIALITY</h2>
      <p className="text-gray-700 mb-3">All information collected about you during this study will be kept confidential to the extent permitted by law. You will be identified by a code number, not by your name.</p>
      <p className="text-gray-700">Your medical records may be reviewed by representatives from the FDA, the study sponsor, and the Institutional Review Board (IRB) that oversees this research.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">COSTS AND COMPENSATION</h2>
      <p className="text-gray-700 mb-3">There is no cost to you for participation in this study. The study sponsor will provide the study drug and cover the costs of all study-related procedures.</p>
      <p className="text-gray-700">You will not receive any payment for participating in this study.</p>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">VOLUNTARY PARTICIPATION</h2>
      <p className="text-gray-700 mb-3">Your participation in this study is completely voluntary. You may choose not to participate or may withdraw from the study at any time without penalty or loss of benefits to which you are otherwise entitled.</p>
      <p className="text-gray-700">Your decision will not affect your current or future medical care at this institution.</p>
    </section>

    <div className="mt-8 pt-6 border-t-2 border-gray-300">
      <h2 className="text-xl font-bold text-gray-900 mb-4">SIGNATURE OF PARTICIPANT</h2>
      <p className="text-gray-700 mb-6">By signing below, I confirm that:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 mb-6">
        <li>I have read this consent form (or it has been read to me)</li>
        <li>All my questions have been answered</li>
        <li>I voluntarily agree to participate in this study</li>
        <li>I will receive a copy of this signed consent form</li>
      </ul>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="border-b-2 border-gray-400 pb-1">
          <p className="text-xs text-gray-500 mb-1">Participant Name (Print)</p>
        </div>
        <div className="border-b-2 border-gray-400 pb-1">
          <p className="text-xs text-gray-500 mb-1">Date</p>
        </div>
        <div className="border-b-2 border-gray-400 pb-1">
          <p className="text-xs text-gray-500 mb-1">Participant Signature</p>
        </div>
        <div className="border-b-2 border-gray-400 pb-1">
          <p className="text-xs text-gray-500 mb-1">Time</p>
        </div>
      </div>
    </div>
  </div>
);

export const vendorCommContent = (
  <div>
    <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">VENDOR COMMUNICATION MATERIALS</h1>
      <p className="text-xl text-gray-700 mb-1">Clinical Trial Supply Chain & Vendor Management</p>
      <p className="text-md text-gray-500 mt-4">Reference Guide | Updated: October 2025</p>
    </div>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">1. VENDOR CONTACT DIRECTORY</h2>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📦 Clinical Trial Supplies</h3>
          <p className="text-gray-700"><strong>Company:</strong> MedSupply Solutions Inc.</p>
          <p className="text-gray-700"><strong>Contact:</strong> Sarah Johnson, Account Manager</p>
          <p className="text-gray-700"><strong>Email:</strong> sjohnson@medsupply.com</p>
          <p className="text-gray-700"><strong>Phone:</strong> (555) 123-4567</p>
          <p className="text-gray-700 mt-2"><strong>Services:</strong> Study drug packaging, labeling, distribution, temperature-controlled storage</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🔬 Central Laboratory Services</h3>
          <p className="text-gray-700"><strong>Company:</strong> Global Lab Partners</p>
          <p className="text-gray-700"><strong>Contact:</strong> Dr. Michael Chen, Project Director</p>
          <p className="text-gray-700"><strong>Email:</strong> mchen@globallabpartners.com</p>
          <p className="text-gray-700"><strong>Phone:</strong> (555) 234-5678</p>
          <p className="text-gray-700 mt-2"><strong>Services:</strong> Sample collection kits, laboratory testing, biomarker analysis, data reporting</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📊 Clinical Data Management</h3>
          <p className="text-gray-700"><strong>Company:</strong> DataCore Clinical Systems</p>
          <p className="text-gray-700"><strong>Contact:</strong> Jennifer Martinez, Implementation Lead</p>
          <p className="text-gray-700"><strong>Email:</strong> jmartinez@datacore.com</p>
          <p className="text-gray-700"><strong>Phone:</strong> (555) 345-6789</p>
          <p className="text-gray-700 mt-2"><strong>Services:</strong> EDC system, database design, data cleaning, query management</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🏥 Site Monitoring Services</h3>
          <p className="text-gray-700"><strong>Company:</strong> Clinical Monitoring Associates (CMA)</p>
          <p className="text-gray-700"><strong>Contact:</strong> Robert Williams, Senior CRA</p>
          <p className="text-gray-700"><strong>Email:</strong> rwilliams@cma-monitoring.com</p>
          <p className="text-gray-700"><strong>Phone:</strong> (555) 456-7890</p>
          <p className="text-gray-700 mt-2"><strong>Services:</strong> On-site monitoring, source data verification, regulatory compliance checks</p>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">2. COMMUNICATION PROTOCOLS</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Standard Communication Procedures</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li><strong>Routine Inquiries:</strong> Email with 24-48 hour response time</li>
            <li><strong>Urgent Issues:</strong> Phone call + email follow-up within 4 hours</li>
            <li><strong>Critical/Safety Issues:</strong> Immediate phone call (24/7 hotline available)</li>
            <li><strong>Weekly Status Updates:</strong> Every Monday by 10 AM EST</li>
            <li><strong>Monthly Review Meetings:</strong> First Thursday of each month at 2 PM EST</li>
          </ul>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h3 className="font-semibold text-red-900 mb-2">⚠️ Escalation Path for Critical Issues</h3>
          <ol className="list-decimal list-inside space-y-1 ml-4 text-gray-700">
            <li>Contact vendor project manager immediately</li>
            <li>If no response within 2 hours, escalate to vendor director</li>
            <li>Document all communications in issue tracking system</li>
            <li>Notify sponsor clinical operations within 4 hours</li>
          </ol>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">3. VENDOR PERFORMANCE METRICS</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Metric</th>
            <th className="border border-gray-300 p-3 text-left">Target</th>
            <th className="border border-gray-300 p-3 text-left">Measurement Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-3">Study Drug Delivery Time</td>
            <td className="border border-gray-300 p-3">≤ 5 business days</td>
            <td className="border border-gray-300 p-3">Per shipment</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-3">Lab Report Turnaround</td>
            <td className="border border-gray-300 p-3">≤ 10 business days</td>
            <td className="border border-gray-300 p-3">Per sample batch</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3">Data Query Resolution Time</td>
            <td className="border border-gray-300 p-3">≤ 15 days</td>
            <td className="border border-gray-300 p-3">Monthly average</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-3">Monitoring Report Submission</td>
            <td className="border border-gray-300 p-3">Within 5 days of visit</td>
            <td className="border border-gray-300 p-3">Per monitoring visit</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">4. REQUIRED DOCUMENTATION</h2>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">All Vendors Must Provide:</h3>
          <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
            <li>Current Certificate of Insurance (COI)</li>
            <li>Quality Management System (QMS) certification</li>
            <li>Confidentiality/Non-Disclosure Agreement (NDA)</li>
            <li>Business Associate Agreement (BAA) for HIPAA compliance</li>
            <li>Conflict of Interest disclosure</li>
            <li>Standard Operating Procedures (SOPs) relevant to services</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700"><strong>Note:</strong> All vendor documentation must be reviewed and approved by Legal and Quality Assurance before contract execution. Documents should be updated annually or upon material changes.</p>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">5. SAMPLE EMAIL TEMPLATES</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Template: Study Drug Shipment Request</h3>
          <div className="font-mono text-sm bg-white p-3 rounded border border-gray-200 mt-2">
            <p className="mb-2"><strong>Subject:</strong> Study Drug Shipment Request - Site [XXX] - Study XYZ-123</p>
            <p className="mb-2">Dear [Vendor Contact],</p>
            <p className="mb-2">Please arrange shipment of study drug for the following:</p>
            <p className="ml-4 mb-2">
              Study Number: XYZ-123<br/>
              Site Number: [XXX]<br/>
              Site Address: [Address]<br/>
              Quantity Needed: [XX] kits<br/>
              Requested Delivery Date: [Date]
            </p>
            <p className="mb-2">Please confirm receipt and provide estimated delivery date.</p>
            <p>Best regards,<br/>[Your Name]</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Template: Issue Escalation</h3>
          <div className="font-mono text-sm bg-white p-3 rounded border border-gray-200 mt-2">
            <p className="mb-2"><strong>Subject:</strong> URGENT - [Issue Description] - Study XYZ-123</p>
            <p className="mb-2">Dear [Vendor Manager],</p>
            <p className="mb-2">I am writing to escalate the following critical issue:</p>
            <p className="ml-4 mb-2">
              Issue: [Description]<br/>
              Impact: [Patient/Study Impact]<br/>
              Initial Report Date: [Date]<br/>
              Current Status: [Status]<br/>
              Required Resolution: [Action Needed]
            </p>
            <p className="mb-2">This issue requires immediate attention. Please confirm receipt and provide action plan within 2 hours.</p>
            <p>Thank you,<br/>[Your Name]</p>
          </div>
        </div>
      </div>
    </section>

    <div className="mt-8 pt-6 border-t-2 border-gray-300">
      <p className="text-sm text-gray-600 text-center">
        <strong>For Questions:</strong> Contact Clinical Operations Team at clinops@company.com | Phone: (555) 999-0000
      </p>
    </div>
  </div>
);
