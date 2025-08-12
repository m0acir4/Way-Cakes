document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos ---
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-btn');
    const addToCartButtons = document.querySelectorAll('.btn-produto');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- Estado da Aplicação ---
    let cart = [];

    // --- Funções ---

    // Função para adicionar item ao carrinho
    function addToCart(event) {
        event.preventDefault();
        const productCard = event.target.closest('.produto-card');
        
        const product = {
            id: Date.now(),
            name: productCard.querySelector('h3').innerText,
            price: parseFloat(productCard.querySelector('.preco').innerText.replace('R$', '').replace(',', '.')),
            image: productCard.querySelector('img').src,
            quantity: 1
        };

        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }
        
        updateCart();
        alert(`${product.name} foi adicionado ao carrinho!`);
    }

    // Função para atualizar o carrinho (visual e contadores)
    function updateCart() {
        renderCartItems();
        renderCartTotal();
        updateCartIconCount();
    }

    // Função para renderizar os itens no modal do carrinho
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }

        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Preço: R$ ${item.price.toFixed(2).replace('.',',')}</p>
                        <p>Qtd: ${item.quantity}</p>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    }

    // Função para calcular e renderizar o total
    function renderCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPrice.innerText = `R$ ${total.toFixed(2).replace('.',',')}`;
    }
    
    // Função para atualizar o número no ícone do carrinho
    function updateCartIconCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
    }

    // ===================================================================
    // ✨ FUNÇÃO CHECKOUT ATUALIZADA ✨
    // ===================================================================
    function checkout() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        // Pega os novos campos de endereço e pagamento
        const endereco = document.getElementById('endereco-input').value;
        const metodoPagamento = document.getElementById('pagamento-input').value;

        // Validação simples para garantir que o endereço foi preenchido
        if (!endereco) {
            alert('Por favor, preencha o seu endereço para a entrega.');
            return;
        }

        // Monta a lista de produtos
        let productList = '';
        cart.forEach(item => {
            productList += `${item.quantity}x - ${item.name}\n`;
        });
        
        // Calcula o total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalFormatted = `R$ ${total.toFixed(2).replace('.',',')}`;

        // Monta a mensagem final, do jeito que você pediu!
        const message = `
Olá, Way Cakes! Gostaria de fazer a seguinte encomenda:

${productList}
Endereço: ${endereco}
Método de pagamento: ${metodoPagamento}

*Total: ${totalFormatted}*
    `;

        const whatsappNumber = '5585991282882'; // <-- LEMBRE-SE DE COLOCAR SEU NÚMERO AQUI
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, '_blank');
    }

    // --- Event Listeners ---
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    checkoutBtn.addEventListener('click', checkout);

});
