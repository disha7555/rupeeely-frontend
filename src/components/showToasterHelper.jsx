const showToast = (type, msg, duration = 3000) => {
  setToasing(true);
  setToastMsg({ type, msg });

  setTimeout(() => {
    setToasing(false);
  }, duration);
};
export default showToast;