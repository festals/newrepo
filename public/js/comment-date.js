const dateContainer = document.getElementById("comment_date");
const today = new Date();
const formattedDate = today.toLocaleDateString();

dateContainer.innerHTML= formattedDate;