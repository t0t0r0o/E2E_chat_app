export const avatars = [
    {
        _id: "abc",
        image:{
            asset:{
                url:"https://image.tienphong.vn/w1000/Uploaded/2023/qqc-lce22/2023_03_13/abb460ab-8ca0-406a-b951-33a1286f1b86-7245.jpeg"
            },
        },
        title: "avatar",
    },

]
export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
}
  


export const API_BASE = "http://192.168.64.83:9000"