// Plain-English question text for every catalogue control ID.
// Legal citations, control IDs, and cluster names never appear on screen.
export const QUESTION_TEXT: Record<string, string> = {
  // §1 Registering with the PDPC
  'A-01': 'Is your organisation registered with the Personal Data Protection Commission (PDPC)?',
  'A-02': 'Is your organisation registered under the correct category (controller, processor, or both)?',
  'A-03': 'Are all the details in your PDPC registration accurate and up to date?',
  'A-04': 'Do you have a process for renewing your PDPC registration when it expires?',
  'A-05': 'Has your organisation paid the correct PDPC registration fee for its size?',

  // §2 How you collect and use data (Lawful Processing)
  'B-01': 'Does your organisation have a clear lawful reason for every type of personal data it processes?',
  'B-02': 'Do you only collect personal data for specific, clearly stated purposes?',
  'B-03': 'Do you collect only the minimum personal data you actually need?',
  'B-04': 'Is the personal data you hold accurate and kept up to date?',
  'B-05': 'Do you collect personal data fairly and openly, not secretly or by deception?',
  'B-06': 'When you collect data directly from people, do you tell them who you are and why?',
  'B-07': 'When you get someone\'s data from a third party, do you still inform that person?',

  // §2 How you collect and use data (Accuracy & Retention)
  'C-01': 'Do you have a clear, written procedure for securely deleting or destroying personal data?',
  'C-02': 'Before using personal data, do you check it is accurate enough for its purpose?',
  'C-03': 'Do you have a documented way to correct or update inaccurate personal data?',

  // §3 Keeping data safe (Security)
  'D-01': 'Does your organisation have security measures in place to protect personal data?',
  'D-02': 'Do you have a written information security policy that is actively maintained?',
  'D-03': 'Have you carried out a security risk assessment for the personal data you hold?',
  'D-04': 'Are only authorised staff able to access personal data relevant to their role?',
  'D-05': 'Is personal data encrypted when stored or sent electronically?',
  'D-06': 'Are systems holding personal data regularly backed up?',
  'D-07': 'Do you securely dispose of physical documents containing personal data?',
  'D-08': 'Are staff regularly trained on data security and their responsibilities?',
  'D-09': 'Do you have a written plan for responding to personal data breaches?',
  'D-10': 'Do you have procedures to detect, handle, and learn from data breaches?',
  'D-11': 'Do you report serious data breaches to the PDPC without undue delay?',
  'D-12': 'Do you record data breaches internally, even minor ones?',
  'D-13': 'Do you notify affected people when a breach is likely to harm them?',

  // §4 Your Data Protection Officer (DPO)
  'E-01': 'Has your organisation appointed a Data Protection Officer (DPO)?',
  'E-02': 'Are the DPO\'s name and contact details in your PDPC registration?',
  'E-03': 'Does your DPO submit the required quarterly compliance reports to the PDPC?',
  'E-04': 'Does your DPO have the resources and authority to do the job properly?',
  'E-05': 'Does your DPO review contracts with any external companies that process data on your behalf?',

  // §5 People's rights over their data (Data Subject Rights)
  'F-01': 'Can people request access to the personal data you hold about them?',
  'F-02': 'Can people request corrections, and do you act on them?',
  'F-03': 'Can people request deletion of their data, and do you have a process for it?',
  'F-04': 'Can people object to how their data is processed, and can you respond?',
  'F-05': 'Can people ask you to stop processing their data, with a process to handle it?',
  'F-06': 'Do you inform people when automated systems make decisions about them?',
  'F-07': 'Do you respond to data rights requests within the time limits the law sets?',
  'F-08': 'Do you obtain parental or guardian consent before processing children\'s personal data?',

  // §5 People's rights (Sensitive Data)
  'G-01': 'Do you have extra safeguards and obtain explicit consent for sensitive personal data (health, ID numbers, biometrics)?',
  'G-02': 'Are staff who handle sensitive personal data aware of the additional obligations that apply?',
  'G-03': 'Do you have specific written policies and consent processes for children\'s personal data?',

  // §6 Working with others & records (Transborder Flow)
  'H-01': 'Do you only transfer personal data outside Tanzania when there\'s a valid legal basis to do so?',
  'H-02': 'When transferring data abroad, do you check the destination has adequate data protection?',

  // §6 Working with others & records (DPIA)
  'I-01': 'Have you conducted a formal Data Protection Impact Assessment (DPIA) for high-risk processing activities?',
  'I-02': 'Is your DPIA documented and reviewed when the processing activity changes?',

  // §6 Working with others & records (Accountability)
  'J-01': 'Do you keep a written record of all your personal data processing activities?',
  'J-02': 'Do you have written data protection policies that are regularly reviewed?',
  'J-03': 'Does senior management take responsibility for data protection compliance?',
  'J-04': 'Do you report data processing activities to the relevant oversight body as required?',
}

// Map catalogue cluster → user-facing section name (6 plain sections)
export const CLUSTER_TO_SECTION: Record<string, string> = {
  'Registration':        'Registering with the PDPC',
  'Lawful Processing':   'How you collect and use data',
  'Accuracy & Retention':'How you collect and use data',
  'Sensitive Data':      'How you collect and use data',
  'Security':            'Keeping data safe',
  'DPO':                 'Your Data Protection Officer',
  'Data Subject Rights': "People's rights over their data",
  'Transborder Flow':    'Working with others & records',
  'DPIA':                'Working with others & records',
  'Accountability':      'Working with others & records',
}

export const SECTION_ORDER = [
  'Registering with the PDPC',
  'How you collect and use data',
  'Keeping data safe',
  'Your Data Protection Officer',
  "People's rights over their data",
  'Working with others & records',
]

// One-line "why this matters" shown under each section header
export const SECTION_SUBTEXT: Record<string, string> = {
  'Registering with the PDPC':
    'Registration is a legal requirement for all organisations that collect or process personal data in Tanzania.',
  'How you collect and use data':
    'The law requires clear lawful reasons for collecting data, transparency with individuals, and proper retention practices.',
  'Keeping data safe':
    'Personal data must be protected from loss, theft, and unauthorised access using measures appropriate to the risk.',
  'Your Data Protection Officer':
    'Organisations processing sensitive or large volumes of personal data must appoint a DPO and register them with the PDPC.',
  "People's rights over their data":
    'Individuals have legal rights to access, correct, and delete their data. You must respond within the PDPA\'s time limits.',
  'Working with others & records':
    'Special rules apply to data transfers abroad, sharing with processors, and documenting your compliance.',
}

// Icons for each section (inline SVG paths)
export const SECTION_ICONS: Record<string, React.ReactNode> = {}

export const MATURITY_DISPLAY: Record<string, string> = {
  'Initial':    'Needs urgent action',
  'Developing': 'Making progress',
  'Managed':    'Well managed',
  'Optimized':  'Fully compliant',
}

export function scoreInterpretation(score: number): string {
  if (score <= 20) return 'Your organisation has critical gaps across most areas of the Personal Data Protection Act. Without urgent action, you are at significant legal and reputational risk. The action plan below shows exactly where to start.'
  if (score <= 40) return 'Your organisation has made a start, but important data protection requirements are still missing. Gaps in registration, data handling, or security controls could expose you to PDPC enforcement. Work through the priority actions below to build a solid foundation.'
  if (score <= 60) return 'Your organisation is on the right track but has not yet met all the requirements needed to register confidently with the PDPC. Closing the gaps identified below will significantly strengthen your compliance posture and reduce your risk exposure.'
  if (score <= 80) return 'Your organisation demonstrates a strong commitment to data protection and meets most of the PDPA requirements. A small number of areas still need attention before you can consider yourself fully compliant. Address the remaining gaps to complete your compliance journey.'
  return 'Your organisation has an exemplary data protection programme that meets the requirements of the Personal Data Protection Act. You are well-positioned to register with the PDPC and can demonstrate to stakeholders, clients, and regulators that personal data is handled responsibly.'
}

// Aggregate cluster scores → section scores (average of mapped clusters)
export function toSectionScores(clusterScores: Record<string, number>): Record<string, number> {
  const sums: Record<string, number[]> = {}
  for (const [cluster, score] of Object.entries(clusterScores)) {
    const section = CLUSTER_TO_SECTION[cluster]
    if (section) (sums[section] ??= []).push(score)
  }
  return Object.fromEntries(
    Object.entries(sums).map(([sec, vals]) => [
      sec,
      Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    ])
  )
}
