export default {
  setBookList(state, bookList) {
    state.bookList=bookList
  },
  setSelectedBook(state, selectedBook) {
    state.selectedBook={...selectedBook}
  },

  setNextNavigationBtn(state, isActive) {
    state.isNextNavigationBtnActive=isActive
  },

  setPreviewImgToBase64(state, {canvasImage}) {
    console.log("base64Img",canvasImage)
    state.base64CanvasImg= canvasImage
  },
};
