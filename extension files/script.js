async function fetchData() {
    const res=await fetch ("https://docs.googleapis.com");
    const record=await res.json();
}
fetchData();