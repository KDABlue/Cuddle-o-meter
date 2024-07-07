export function changeTitleColor() {
    const title = document.getElementById('title');
    const colors = ['red', 'green', 'blue', 'orange', 'purple'];
    let currentColorIndex = 0;

    setInterval(() => {
        title.style.color = colors[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % colors.length;
    }, 2000); 
}
