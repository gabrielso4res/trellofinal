import { CONSTANTS } from "../actions";
let listID = 2;
let cardID = 5;

const initialState = {
    lists: [
      {
        title: "Para fazer",
        id: `list-${0}`,
        cards: [
          {
            id: `card-${0}`,
            text: "Trello Clone",
          },
          {
            id: `card-${1}`,
            text: "Estilo",
          },
        ],
      },
      {
        title: "Fazendo",
        id: `list-${1}`,
        cards: [
          {
            id: `card-${2}`,
            text: "Refatorando",
          },
          {
            id: `card-${3}`,
            text: "Commit",
          },
          {
            id: `card-${4}`,
            text: "Teste",
          },
        ],
      },
    ],
};

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.ADD_LIST:
      const newList = {
        title: action.payload,
        cards: [],
        id: `list-${listID}`,
      };
      listID += 1;
      return {...state, lists: [...state.lists, newList]};

    case CONSTANTS.ADD_CARD: {
      const newCard = {
        text: action.payload.text,
        id: `card-${cardID}`,
      };
      cardID += 1;

      const newState = state.lists.map((list) => {
        if (list.id === action.payload.listID) {
          return {
            ...list,
            cards: [...list.cards, newCard],
          };
        } else {
          return list;
        }
      });

      return {...state, lists: newState};
    }

    case CONSTANTS.DRAG_HAPPENED:
      const newState = [...state.lists];
      const {
        droppableIdStart,
        droppableIdEnd,
        droppableIndexStart,
        droppableIndexEnd,
        type,
      } = action.payload;

      if (type === "list") {
        const list = newState.splice(droppableIdStart, 1);
        newState.splice(droppableIndexEnd, 0, ...list);
        return newState;
      }

      if (droppableIdStart === droppableIdEnd) {
        const list = state.lists.find((list) => droppableIdStart === list.id);
        const card = list.cards.splice(droppableIndexStart, 1);
        list.cards.splice(droppableIndexEnd, 0, ...card);
      }

      if (droppableIdStart !== droppableIdEnd) {
        const listStart = state.lists.find((list) => droppableIdStart === list.id);
        const card = listStart.cards.splice(droppableIndexStart, 1);
        const listEnd = state.lists.find((list) => droppableIdEnd === list.id);
        listEnd.cards.splice(droppableIndexEnd, 0, ...card);
      }
      return {...state, lists: newState};

    case CONSTANTS.EDIT_LIST_TITLE: {
      const { listID, newTitle } = action.payload;
      return {
        ...state,
        [listID]: { ...state[listID], title: newTitle },
      };
    }

    default:
      return state;
  }
};

export default listsReducer;
