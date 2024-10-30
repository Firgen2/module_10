let limit = 6;
const btnLoadMore = document.getElementById("load_more");
const modal = document.getElementById("new-book-form");
const openModalButton = document.getElementById("add-books");
const closeModalButton = document.getElementById("close-modal");

async function notify(status, text) {

    let icon;
    if (status === "success") icon = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:none;stroke:#1eff00;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style> </defs> <title></title> <g id="checkmark"> <line class="cls-1" x1="3" x2="12" y1="16" y2="25"></line> <line class="cls-1" x1="12" x2="29" y1="25" y2="7"></line> </g> </g></svg>`
    else if (status === "load") icon = `<svg fill="#8c8c8c" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 367.136 367.136" xml:space="preserve" stroke="#8c8c8c"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M336.954,87.494C318.821,59.1,293.251,36.318,263.01,21.613l-13.119,26.979c52.77,25.661,85.551,78.029,85.551,136.669 c0,83.744-68.131,151.874-151.874,151.874S31.694,269.005,31.694,185.262c0-49.847,24.899-96.439,65.042-124.571L149.7,113.91V0 H36.335l38.953,39.14C57.727,52.164,42.557,68.287,30.582,86.871c-18.898,29.33-28.888,63.352-28.888,98.391 c0,100.286,81.588,181.874,181.874,181.874s181.874-81.588,181.874-181.874C365.442,150.485,355.59,116.678,336.954,87.494z"></path> </g></svg>`
    else icon = `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2.32129 2.32363C2.72582 1.9191 3.38168 1.9191 3.78621 2.32363L25.6966 24.234C26.1011 24.6385 26.1011 25.2944 25.6966 25.6989C25.2921 26.1035 24.6362 26.1035 24.2317 25.6989L2.32129 3.78854C1.91676 3.38402 1.91676 2.72815 2.32129 2.32363Z" fill="#ff0000"></path><path d="M25.6787 2.30339C25.2742 1.89887 24.6183 1.89887 24.2138 2.30339L2.30339 24.2138C1.89887 24.6183 1.89887 25.2742 2.30339 25.6787C2.70792 26.0832 3.36379 26.0832 3.76831 25.6787L25.6787 3.76831C26.0832 3.36379 26.0832 2.70792 25.6787 2.30339Z" fill="#ff0000"></path></g></svg>`
    const notify_cont = document.getElementById("notification_container");

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
        ${icon}
        <p>${text}</p>
    `;

    notify_cont.prepend(notification);
    setTimeout(() => {
        notification.classList.add("hide");
        notification.addEventListener("animationend", () => {
            notify_cont.removeChild(notification);
        });
    }, 5000);
}

async function fetchData() {
    try {
        notify("load", "Loading data...")
        const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`);
        if (!response.ok) {
            notify("fail", "Failed!")
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        notify("success", "Load Successful")
        return data
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function updateData(data) {
    const menu = document.getElementById("main_container_products");
    menu.innerHTML = ''; 
    data.forEach(product => {
        const productHTML = `
        <div class="product" id="${product.id}">
            <div class="product_img">
                <button class="button_delete" data-id="${product.id}"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                <img src="${product.image}" alt="product" />
            </div>
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <p>$${product.price}</p>
        </div>
        `;
        menu.insertAdjacentHTML('beforeend', productHTML);
    });

    document.querySelectorAll('.button_delete').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.closest('.button_delete').getAttribute('data-id');
            await deleteProduct(productId);
        });
    });    
}

async function deleteProduct(productId) {
    try {
        notify("load", "Removing product...")
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // console.log(`Product with ID ${productId} has been deleted`);
            notify("success", "Product has been deleted!")
        } else {
            notify("fail", "Failed!")
            console.error('Failed to delete product');
        }
    } catch (error) {
        notify("fail", "Failed!")
        console.error('Error deleting product:', error);
    }
}

async function loadMore() {
    limit += 6;
    const response = await fetchData()
    await updateData(response);
    if (limit >= 20) {
        btnLoadMore.style.display = "none";
    }
}

async function postData(data) {
    try {
        notify("load", "Adding product...")
        const response = await fetch(`https://fakestoreapi.com/products`,{
            method: "POST",
            body: JSON.stringify({
                title: data.title,
                price: data.price,
                description: data.description,
                image: data.image,
                category: data.category
            })
        });
        if (!response.ok) {
            notify("fail", "Failed!")
            throw new Error('Network response was not ok');
        }

        const data1 = await response.json();
        console.log(data1)
        notify("success", "Add Successful")
        return data1
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function getParam() {
    const newProduct = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
        image: document.getElementById("image").value,
        category: document.getElementById("category").value
    };

    const result = await postData(newProduct);

    if (result) {  // Очистка полей формы только после успешной отправки
        document.getElementById("title").value = '';
        document.getElementById("price").value = '';
        document.getElementById("description").value = '';
        document.getElementById("image").value = '';
        document.getElementById("category").value = '';
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetchData()
    await updateData(response)
    btnLoadMore.addEventListener("click", loadMore);
    document.getElementById("add_product").addEventListener("click", () => {
        modal.classList.add("active");
    });

    openModalButton.addEventListener("click", async (event) => {
        event.preventDefault();
        modal.classList.add("active");
        await getParam();
    });

    closeModalButton.addEventListener("click", (event) => {
        event.preventDefault();
        modal.classList.remove("active");
    });
});