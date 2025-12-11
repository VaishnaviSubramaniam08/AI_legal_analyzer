import express from "express";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Format date helper
const formatDate = (date) => {
  const d = new Date(date);
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Generate Complaint Letter
router.post("/generate-complaint", verifyToken, async (req, res) => {
  try {
    const { recipientName, recipientAddress, issueDescription, desiredResolution, incidentDate } = req.body;

    if (!recipientName || !issueDescription || !desiredResolution) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const letterContent = `
TO WHOM IT MAY CONCERN

Date: ${formatDate(new Date())}

${recipientAddress ? `Address: ${recipientAddress}\n` : ""}
Subject: Formal Complaint Regarding ${issueDescription.substring(0, 50)}...

Dear ${recipientName},

I am writing to lodge a formal complaint regarding the matter described below:

BACKGROUND:
${incidentDate ? `Incident Date: ${formatDate(incidentDate)}\n` : ""}
Issue Description:
${issueDescription}

DETAILS:
The above-mentioned issue has caused considerable inconvenience and concern. I have attempted to resolve this matter through informal means, but without satisfactory resolution.

DESIRED RESOLUTION:
${desiredResolution}

CLOSING:
I request that you address this complaint within 30 days of receiving this letter. Should you require any additional information or clarification, please feel free to contact me.

I look forward to a prompt and satisfactory resolution to this matter.

Yours faithfully,

____________________________
[Your Name]
[Your Contact Number]
[Your Email Address]
`;

    res.json({
      success: true,
      letter: letterContent.trim(),
      metadata: {
        recipientName,
        issueDescription,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate Notice
router.post("/generate-notice", verifyToken, async (req, res) => {
  try {
    const { recipientName, recipientAddress, subject, details, deadline, noticeType } = req.body;

    if (!recipientName || !subject || !details) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    let noticeContent = `
LEGAL NOTICE
${deadline ? `(Date: ${formatDate(new Date())})` : ""}

TO:
${recipientName}
${recipientAddress || ""}

SUBJECT: ${subject}

NOTICE IS HEREBY GIVEN AS FOLLOWS:

1. BACKGROUND:
${details}

2. PARTICULARS OF THE CLAIM:
This notice is served in accordance with the applicable laws and regulations. The recipient is required to take appropriate action as detailed below.

3. REQUIRED ACTION:
${deadline ? `You are required to comply with this notice within ${deadline} days from the date of this notice.` : "You are required to comply with this notice within a reasonable timeframe."}

4. CONSEQUENCES OF NON-COMPLIANCE:
In case of non-compliance with the terms of this notice, further legal action may be initiated against you, which may include:
- Filing of a case in the appropriate court
- Claims for damages and costs
- Such other relief as may be deemed appropriate by the court

5. MODE OF SERVICE:
This notice is being served upon you through registered post/email/personal delivery.

DATED THIS ${formatDate(new Date())}

LEGAL NOTICE SERVED BY:
____________________________
[Your Name]
[Your Address]
[Your Contact Details]

ACKNOWLEDGED BY:
____________________________
[Recipient's Signature/Date]
`;

    res.json({
      success: true,
      notice: noticeContent.trim(),
      metadata: {
        recipientName,
        subject,
        noticeType: noticeType || "default",
        generatedAt: new Date().toISOString(),
        deadline
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
