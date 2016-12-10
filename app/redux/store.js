import {
  LOADING, GRANT_AUTHORITY, HANDLE_ROUTE, OPEN_EDITOR, CLOSE_EDITOR,
} from './constants'

function checkAuthentication() {
  if (process.env.NODE_ENV === 'development') {
    return true
  } else {
    // check cookies?
    return false
  }
}

const initialState = {
  loading: false,
  authenticated: checkAuthentication(),
  currentType: 'note',
  editor: {
    hidden: true,
    note: {},
  },
}

const Store = (state, action) => {
  switch(action.type) {
    case LOADING: return {
      ...state,
      loading: action.data,
    }
    case GRANT_AUTHORITY: return {
      ...state,
      authenticated: action.data,
    }
    case HANDLE_ROUTE: return {
      ...state,
      currentType: action.data,
    }
    case OPEN_EDITOR: return {
      ...state,
      editor: {
        hidden: false,
        note: action.data,
      },
    }
    case CLOSE_EDITOR: return {
      ...state,
      editor: {
        hidden: true,
        note: {},
      },
    }
    default: return initialState
  }
}

export default Store