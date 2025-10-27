/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {'active'|'archived'} status
 * @property {string[]} tags
 * @property {number} order
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'applied'|'screen'|'tech'|'offer'|'hired'|'rejected'} stage
 * @property {string} jobId
 * @property {Array<{text: string, timestamp: string}>} notes
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {'single-choice'|'multi-choice'|'short-text'|'long-text'|'numeric'|'file-upload'} type
 * @property {string} question
 * @property {string[]} [options]
 * @property {boolean} required
 * @property {{min: number, max: number}} [range]
 * @property {number} [maxLength]
 * @property {{dependsOn: string, value: string}} [condition]
 */

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} title
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} Assessment
 * @property {string} jobId
 * @property {Section[]} sections
 */

/**
 * @typedef {Object} TimelineEntry
 * @property {string} timestamp
 * @property {string} stage
 * @property {string} [note]
 */