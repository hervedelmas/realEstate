import axios from "axios"

export default {
  async properties(queries) {
    let res = await axios.get("http://localhost:8000/properties?queries=" + queries);
    return res.data;
  },
  async property(data) {
    let res = await axios.post('http://localhost:8000/uploads', data.formData);
    if (res.status == 200) {
      data.data.update.thumbnail = "http://localhost:8000/uploads/" + res.data.filename;
      res = await axios.post('http://localhost:8000/property', data);
      return res.data;
    } else { alert("Upload fail"); }
  },
  async deleteProperty(query) {
    let res = await axios.get("http://localhost:8000/deleteProperty?queries=" + query);
    return res.data;
  }
}