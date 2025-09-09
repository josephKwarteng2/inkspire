import { useReducer } from "react";
import type {
  FilterState,
  SortKey,
  SortDirection,
  ViewFilter,
} from "@/types/post";

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT_KEY"; payload: SortKey }
  | { type: "SET_SORT_DIRECTION"; payload: SortDirection }
  | { type: "SET_STATUS_FILTER"; payload: string }
  | { type: "SET_TAG_FILTER"; payload: string }
  | { type: "SET_AUTHOR_FILTER"; payload: string }
  | { type: "SET_VIEW_FILTER"; payload: ViewFilter }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_POSTS_PER_PAGE"; payload: number }
  | { type: "RESET_FILTERS" };

const initialState: FilterState = {
  search: "",
  sortKey: "date",
  sortDirection: "desc",
  statusFilter: "",
  tagFilter: "",
  authorFilter: "",
  viewFilter: "active",
  currentPage: 1,
  postsPerPage: 10,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, currentPage: 1 };
    case "SET_SORT_KEY":
      return { ...state, sortKey: action.payload };
    case "SET_SORT_DIRECTION":
      return { ...state, sortDirection: action.payload };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload, currentPage: 1 };
    case "SET_TAG_FILTER":
      return { ...state, tagFilter: action.payload, currentPage: 1 };
    case "SET_AUTHOR_FILTER":
      return { ...state, authorFilter: action.payload, currentPage: 1 };
    case "SET_VIEW_FILTER":
      return { ...state, viewFilter: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_POSTS_PER_PAGE":
      return { ...state, postsPerPage: action.payload, currentPage: 1 };
    case "RESET_FILTERS":
      return initialState;
    default:
      return state;
  }
}

export const useFilterReducer = () => {
  return useReducer(filterReducer, initialState);
};
