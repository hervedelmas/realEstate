<template>
  <div class="container">
    <div id="searchProperties" class="box subtitle container is-1">
      SEARCH Properties :
      <div class="columns is-mobile">
        <div class="column">
          <input
            class="input"
            type="text"
            v-model="searchName"
            placeholder="name"
          />
        </div>
        <div class="column">
          <input
            class="input"
            type="text"
            v-model="searchLocation"
            placeholder="location"
          />
        </div>
        <div class="column">
          <input
            class="input"
            type="text"
            v-model="searchPrice"
            placeholder="price"
          />
        </div>
      </div>

      <button class="button is-primary is-light" @click="addProperty()">
        ADD Property
      </button>
      <button
        style="float: right"
        class="button is-link is-light"
        type="submit"
        @click="
          propertiesData(
            JSON.stringify({
              name: searchName,
              location: searchLocation,
              price: searchPrice,
            })
          )
        "
      >
        SEARCH
      </button>
    </div>
    <div id="addProperty" class="box subtitle hide container is-1">
      <form @submit.prevent="propertyData" enctype="multipart/form-data">
        ADD Property :
        <div class="img">
          <div class="preview">
            <img ref="image" v-bind="image" v-if="url" :src="url" />
          </div>
        </div>
        <input class="input" ref="file" type="file" @change="onFileChange" />
        <input type="text" v-model="key" placeholder="key" hidden />
        <div class="columns is-mobile">
          <div class="column">
            <input
              class="input"
              type="text"
              v-model="name"
              placeholder="name"
            />
          </div>
          <div class="column">
            <input
              class="input"
              type="text"
              v-model="location"
              placeholder="location"
            />
          </div>
          <div class="column">
            <input
              class="input"
              type="text"
              v-model="price"
              placeholder="price"
            />
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <button
              class="button is-danger is-light"
              type="submit"
              @click="deletePropertyData({ name: key })"
            >
              DELETE
            </button>
          </div>
          <div class="column">
            <button class="button is-link is-light" @click="searchProperties()">
              CANCEL
            </button>
          </div>
          <div class="column">
            <button
              style="float: right"
              class="button is-primary is-light"
              type="submit"
              @click="
                propertyData({
                  data: {
                    query: { name: key },
                    update: {
                      name: name,
                      location: location,
                      price: price,
                      thumbnail: url,
                    },
                  },
                })
              "
            >
              SUBMIT
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="box container is-1">
      <div class="box columns is-multiline">
        <div
          v-for="property in properties"
          :property="property"
          :key="property.name"
          class="column"
        >
          <div
            class="card"
            @click="propertyUp(JSON.stringify({ name: `${property.name}` }))"
          >
            <div class="card-content">
              <h2 class="">name : {{ property.name }}</h2>
              <img :src="`${property.thumbnail}`" />
              <div>price : {{ property.price }}</div>
              <div>location : {{ property.location }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import actions from "@/actions/actions.js";
export default {
  name: "listProperties",
  components: {},
  data() {
    return {
      property: {},
      properties: [],
      key: "",
      name: "",
      location: "",
      price: "",
      thumbnail: "",
      searchName: "",
      searchLocation: "",
      searchPrice: "",
      url: null,
      image: "",
      file: "",
    };
  },
  created() {
    this.propertiesData(JSON.stringify({}));
  },
  methods: {
    async propertiesData(data) {
      actions.properties(JSON.stringify(data)).then(
        ((data) => {
          this.$set(this, "properties", data.properties);
        }).bind(this)
      );
    },
    async deletePropertyData(data) {
      actions.deleteProperty(JSON.stringify(data)).then(
        ((data) => {
          this.$set(this, "properties", data.properties);
        }).bind(this)
      );
    },
    async propertyData(data) {
      console.log(data.data.query.name);
      if (data.data.update.name == "") {
        alert("The name must be entered");
      } else {
        if (data.data.query.name == "") {
          data.data.query.name = data.data.update.name;
        }
        const formData = new FormData();
        formData.append("file", this.file);
        data.formData = formData;
        actions.property(data).then(
          ((data) => {
            this.$set(this, "properties", data.properties);
          }).bind(this)
        );
      }
    },
    async propertyUp(data) {
      actions.properties(JSON.stringify(data)).then(
        ((data) => {
          this.key = data.properties[0].name;
          this.location = data.properties[0].location;
          this.price = data.properties[0].price;
          this.name = data.properties[0].name;
          this.url = data.properties[0].thumbnail;
          document.getElementById("addProperty").style.display = "block";
          document.getElementById("searchProperties").style.display = "none";
        }).bind(this)
      );
    },
    addProperty() {
      this.url = "";
      this.key = "";
      this.location = "";
      this.price = "";
      this.name = "";
      document.getElementById("addProperty").style.display = "block";
      document.getElementById("searchProperties").style.display = "none";
    },
    searchProperties() {
      document.getElementById("addProperty").style.display = "none";
      document.getElementById("searchProperties").style.display = "block";
    },
    onFileChange(e) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0];
      this.file = file;

      this.url = "";
      if (!allowedTypes.includes(file.type)) {
        alert("Filetype is wrong!!");
      } else if (file.size > 500000) {
        alert("Too large, max size allowed is 500kb");
      } else {
        this.url = URL.createObjectURL(e.target.files[0]);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.hide {
  display: none;
}

.preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview img {
  max-width: 100%;
  max-height: 500px;
}
img {
  height: 200px;
  width: 100%;
  border-radius: 0.375em;
}
.card {
  height: 300px;
  width: 100%;
  background-position: center;
  background-size: cover;
  text-align: center;
  background-color: rgb(255, 255, 255);
  border-radius: 0.375em;
}

.card-content {
  padding-top: 5px;
  height: 290px;
  position: absolute;
  color: rgb(43, 103, 150);
  background-color: rgb(255, 253, 253);
  top: 0;
  width: 100%;
  border-radius: 0.375em;
  span {
    font-size: 18px;
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: 10px;
    right: 0;
  }
  h2 {
    margin-top: 10px;
  }
}
</style>
