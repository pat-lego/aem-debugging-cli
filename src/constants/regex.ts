/**
 * Creates a Regex with 3 groups the first being the time, the second being the error code and the third being the message
 * @example
 * ([0-9]{2}.[0-9]{2}.[0-9]{4})\s([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})\s(\*INFO\*|\*WARN\*|\*ERROR\*)(.*)
 */
const LOG_ERROR_PATTERN = /([0-9]{2}.[0-9]{2}.[0-9]{4})\s([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})\s(\*INFO\*|\*WARN\*|\*ERROR\*)(.*)/

/**
 * Regex applied to incoming requests from the request log
 * @example
 * ([0-9]{2}.[0-9]{2}.[0-9]{4})\s([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})\s(\*INFO\*|\*WARN\*|\*ERROR\*)\s([[A-Za-z0-9-]+])\s([A-Za-z\.]+)\s([0-9]{2}\/[A-Za-z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}\s\+[0-9]{4})\s([[0-9]+])\s(\-\>)\s([A-Za-z]{3,6})\s([A-Za-z0-9-/\.\?\:\&\=\;]+)\s(HTTP\/[0-9-\.]{3})
 */
// eslint-disable-next-line no-useless-escape
const LOG_INCOMING_REQUEST = /([0-9]{2}.[0-9]{2}.[0-9]{4})\s([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})\s(\*INFO\*|\*WARN\*|\*ERROR\*)\s([[A-Za-z0-9-]+])\s([A-Za-z\.]+)\s([0-9]{2}\/[A-Za-z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}\s\+[0-9]{4})\s([[0-9]+])\s(\-\>)\s([A-Za-z]{3,6})\s([A-Za-z0-9-/\.\?\:\&\=\;]+)\s(HTTP\/[0-9-\.]{3})/

/**
 * Regex applied to the outgoing requests from the request log
 * @example
 * ([0-9]{2}.[0-9]{2}.[0-9]{4})\s([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})\s(\*INFO\*|\*WARN\*|\*ERROR\*)\s([[A-Za-z0-9-]+])\s([A-Za-z\.]+)\s([0-9]{2}\/[A-Za-z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}\s\+[0-9]{4})\s([[0-9]+])\s(\<\-)\s([0-9]{3})\s([A-Za-z0-9-/\.\?\:\&\=\;]+)\s([0-9]+ms)
 */
// eslint-disable-next-line no-useless-escape
const LOG_OUTGOING_REQUEST = /([0-9]{2}.[0-9]{2}.[0-9]{4})\s([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})\s(\*INFO\*|\*WARN\*|\*ERROR\*)\s([[A-Za-z0-9-]+])\s([A-Za-z\.]+)\s([0-9]{2}\/[A-Za-z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}\s\+[0-9]{4})\s([[0-9]+])\s(\<\-)\s([0-9]{3})\s([A-Za-z0-9-/\.\?\:\&\=\;]+)\s([0-9]+ms)/

export default { LOG_ERROR_PATTERN, LOG_INCOMING_REQUEST, LOG_OUTGOING_REQUEST }