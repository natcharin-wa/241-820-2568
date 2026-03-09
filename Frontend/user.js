const BASE_URL = "http://localhost:8000";
// 1. Load user data จาก api

// 2. นำ user ที่โหลดมาแสดงในหน้าเว็บ

const loadData = async () => {
    // 1. Load user data จาก api
    const response = await axios.get(`${BASE_URL}/users`);
    console.log(response.data);
    const userDOM = document.getElementById("user");
    let htmlData = '<div>';
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i];
        htmlData += ` <div> 
        ${user.firstname} ${user.lastName}
        <button>Edit</button>
        <button class='delete' data-id='${user.id}'>Delete</button>
        </div>`
    }

    htmlData = '</div';
    userDOM.innerHTML = htmlData;

    const deleteDOMs = document.getElementsByClassName("delete");
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener("click", async (event) => {
            // ดึง id ของ user ที่ต้องการลบจาก data-id attribute
            const id = event.target.dataset.id;
            try{
                await axios.delete(`${BASE_URL}/users/${id}`);
                loadData(); //โหลดข้อมูลใหม่หลังจากลบสำเร็จ
            }catch(error){
                console.error("Error deleting user:", error);
            }
        });
    }
}