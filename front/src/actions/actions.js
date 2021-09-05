import axios from "axios"

export default {
  async properties(queries) {
    let res = await axios.get("http://localhost:8000/properties?queries=" + queries);
    return res.data;
  },
  async property(data) {
    if (data.formData) {
      let res = await axios.post('http://localhost:8000/uploads', data.formData);
      if (res.status == 200) {
        data.data.update.thumbnail = "http://localhost:8000/uploads/" + res.data.filename;
      } else { alert("Upload image fail"); }
    }
    let res = await axios.post('http://localhost:8000/property', data);
    return res.data;
  },
  async deleteProperty(query) {
    let res = await axios.get("http://localhost:8000/deleteProperty?queries=" + query);
    return res.data;
  }
}