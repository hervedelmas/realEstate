import axios from "axios"

export default {
  async properties(queries) {
    let res = await axios.get("http://localhost:8000/properties?queries=" + queries);
    return res.data;
  },
  async property(data) {
    let res = await axios.post('http://localhost:8000/property', data);
    return res.data;
  },
  async deleteProperty(query) {
    let res = await axios.get("http://localhost:8000/deleteProperty?queries=" + query);
    return res.data;
  }
}