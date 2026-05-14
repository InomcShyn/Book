import { setLoading } from "@/features/Outlet/outlet.slice";
import { createListenerMiddleware, isAsyncThunkAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const serviceListenerMiddleware = createListenerMiddleware();

serviceListenerMiddleware.startListening({
  predicate: isAsyncThunkAction,
  effect: async (action, listenApi) => {
    const { type, payload, meta } = action;
    const baseType = type.replace(/\/(pending|fulfilled|rejected)$/, '');
    
    if (type.endsWith('/pending')) {
      listenApi.dispatch(setLoading({ actionType: baseType, isLoading: true }));
    } else if (type.endsWith('/fulfilled') || type.endsWith('/rejected')) {
      await new Promise(resolve => setTimeout(resolve, 400));
      listenApi.dispatch(setLoading({ actionType: baseType, isLoading: false }));
    }

    if (type.endsWith('/rejected')) {
      const errorMessage = payload || 'An error occurred';
      if (meta?.skipError) return;

      if (!meta?.skipErrorToast) {
        toast.error(errorMessage, {
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
        });
      }
    }

    if (type.endsWith('/fulfilled')) {
      if (meta?.showSuccessToast) {
        toast.success(meta.successMessage || 'Operation successful', {
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
        });
      }
    }
  }
})