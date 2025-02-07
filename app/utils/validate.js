export const EmptyValidator = async (prop) => {
    console.log("Prop:",prop)
  const keys = Object.keys(prop);
  keys.map((key) => {
    if (prop[key] == "") {
      return { status: false, message: "Fill all form" };
    }
  });

  return { status: true, message: "All fields available" };
};
