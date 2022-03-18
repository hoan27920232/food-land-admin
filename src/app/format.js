export const formatCurrency = (money) => {
    return Number(money).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
}
export const formatPhone =(phonenumber)  => {
  const phoneArr = []
  if (phonenumber?.length === 11) {
    phoneArr.push(phonenumber?.substr(0, 4))
    phoneArr.push(phonenumber?.substr(4, 3))
    phoneArr.push(phonenumber?.substr(7, 4))
  } else if (phonenumber?.length === 10) {
    phoneArr.push(phonenumber?.substr(0, 3))
    phoneArr.push(phonenumber?.substr(3, 3))
    phoneArr.push(phonenumber?.substr(6, 4))
  } else phoneArr.push(phonenumber)
  return phoneArr.join('.')
}