import post from './post'
import contentTable from './contentTable'

// contentTable must be registered so Portable Text can insert it next to Image.
export const schemaTypes = [contentTable, post]
