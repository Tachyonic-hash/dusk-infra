import {
  ADD_NODE_UPDATE,
  UPDATE_CPU_READ,
  UPDATE_MEM_READ,
  UPDATE_NET_READ,
  UPDATE_LOG_READ,
  UPDATE_DISK_READ,
  ADD_REGION,
  CONNECTING,
  CONNECTED,
  CONNECTION_ERROR,
  DISCONNECTED,
  UPDATE_LAST_BLOCK_INFO
} from "../action-types";

const initialState = {
  status: "disconnected",
  lastBlock: {
    height: null,
    hash: null,
    timestamp: null
  },
  cpu: [],
  memory: [],
  net: [],
  log: [],
  disk: 0,
  regions: {},
  nodes: [],
  updates: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_NODE_UPDATE: {
      let { hostname, ...update } = action.payload;
      return {
        ...state,
        nodes: [
          ...state.nodes,
          ...(!(hostname in state.updates) ? [hostname] : [])
        ],
        updates: {
          ...state.updates,
          [hostname]: [update, ...(state.updates[hostname] || [])]
        }
      };
    }

    case ADD_REGION: {
      const nodes = state.regions[action.payload.region] || [];

      return {
        ...state,
        regions: {
          ...state.regions,
          [action.payload.region]: [
            ...nodes,
            ...(nodes.includes(action.payload.hostname)
              ? []
              : [action.payload.hostname])
          ]
        }
      };
    }

    case UPDATE_CPU_READ: {
      let { type, ...item } = action;
      return {
        ...state,
        cpu: [item, ...state.cpu]
      };
    }

    case UPDATE_NET_READ: {
      let { type, ...item } = action;
      return {
        ...state,
        net: [item, ...state.net]
      };
    }

    case UPDATE_LOG_READ: {
      let { type, ...item } = action;
      return {
        ...state,
        log: [item, ...state.log]
      };
    }

    case UPDATE_DISK_READ: {
      let { type, ...item } = action;
      return {
        ...state,
        disk: [item] // We add the missing slice to form a 100% pie
      };
    }

    case UPDATE_MEM_READ: {
      let { type, ...item } = action;
      return {
        ...state,
        memory: [item, ...state.memory]
      };
    }

    case UPDATE_LAST_BLOCK_INFO: {
      let { height, hash, timestamp } = action.payload;

      return height > state.lastBlock.height
        ? {
            ...state,
            lastBlock: {
              height,
              hash,
              timestamp
            }
          }
        : state;
    }

    case CONNECTING: {
      return {
        ...state,
        status: "connecting"
      };
    }

    case CONNECTED: {
      return {
        ...state,
        status: "connected"
      };
    }

    case DISCONNECTED: {
      return {
        ...state,
        status: "disconnected"
      };
    }

    case CONNECTION_ERROR: {
      return {
        ...state,
        status: "error"
      };
    }

    default:
      return state;
  }
}
