import { useSelector } from "react-redux";

const useActionLoader = (actionType) => {
  return useSelector((state) => Boolean(state.outlet.loading.actions[actionType]));
}

export default useActionLoader;