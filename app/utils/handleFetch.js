import toast from "react-hot-toast";

export const handleFetch = async (calledFunction, name, signal) => {
  try {
    const response = await calledFunction();
    if (response.error) throw response.error;
    toast.success(`Successfully fetched ${name}`);
    if (signal==="add") {
      sessionStorage.setItem(name, JSON.stringify(response));
    }

    return response;
  } catch (err) {
    console.error(`Error fetching ${name}:`, err);
    toast.error(`Failed to fetch ${name}`);
    return null;
  }
};
