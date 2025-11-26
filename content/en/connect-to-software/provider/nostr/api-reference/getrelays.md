# getRelays

### Method

async function getRelays(): { [url: string]: {read: boolean, write: boolean} } 

```

### Response

returns a basic map of relay urls to relay policies

### Example

```typescript
const provider = (window.$onekey &#x26;&#x26; window.$onekey.nostr) || window.nostr;

const event = async provider.getRelays()

```

### Demo


<iframe src="https://codepen.io/OneKeyHQ/pen/vYbzmoJ" width="100%" height="400" frameborder="0" allowfullscreen></iframe>

