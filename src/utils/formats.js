export const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  export const formatDateTime12Hr = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    
    hours = hours % 12 || 12; // Convert 0 (midnight) and 12 (noon) correctly

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};
