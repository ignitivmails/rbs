import config from '@payload-config'
import { getPayload } from 'payload'

/** Payload Local API — runs in-process, no HTTP round trip. */
export const getPayloadClient = () => getPayload({ config })
