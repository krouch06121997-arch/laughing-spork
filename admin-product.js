// កូដសម្រាប់គ្រប់គ្រងការ Add Product ដាច់ដោយឡែក
const CLOUD_NAME = "qeil4wud";
const UPLOAD_PRESET = "ml_default";

window.addNewProduct = async function() {
    const name = document.getElementById('prodNameInput').value.trim();
    const price = document.getElementById('prodPriceInput').value;
    const stock = document.getElementById('prodStockInput').value;
    const fileInput = document.getElementById('prodImageFile');
    const file = fileInput.files[0];
    const saveBtn = document.getElementById('saveProductBtn');

    if (!name || !price || !file) {
        alert("សូមបំពេញឈ្មោះ តម្លៃ និងជ្រើសរើសរូបភាពផ្កាជាមុនសិន!");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerText = "កំពុង Upload រូបភាព...";

    try {
        // ១. Upload រូបភាពទៅ Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const cloudinaryData = await cloudinaryRes.json();

        if (!cloudinaryData.secure_url) {
            throw new Error(cloudinaryData.error?.message || "Cloudinary Upload failed");
        }
        const imageUrl = cloudinaryData.secure_url;

        saveBtn.innerText = "កំពុងរក្សាទុក Product...";

        // ២. ส่งទិន្នន័យទៅ Server
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, imageUrl, stock })
        });

        const result = await response.json();
        if (result.success) {
            alert("✅ បន្ថែមផលិតផលផ្កាបានជោគជ័យ!");
            // សម្អាត Form ក្រោយពេលជោគជ័យ
            document.getElementById('prodNameInput').value = '';
            document.getElementById('prodPriceInput').value = '';
            fileInput.value = '';
            
            // ហៅទាញយកទំនិញមកបង្ហាញឡើងវិញ (ប្រសិនបើមាន Function នេះក្នុង Project)
            if (typeof fetchProducts === 'function') {
                fetchProducts();
            }
        } else {
            alert("❌ បរាជ័យ: " + result.error);
        }
    } catch (err) {
        alert("កំហុសឆ្គង: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "💾 រក្សាទុកផលិតផល (Save Product)";
    }
};
