<template>
  <div class="hello">
      <h1>Updates</h1>
      <el-input v-model="filter" placeholder="Filter by user"></el-input>
      <el-row :gutter="20">
        <transition-group name="flip-list">
            <el-col :span="6" class="box-card" v-for="update of filteredUpdates" :key="update._id">
                <el-card>
                    <div slot="header" class="clearfix grid-content">
                        <span>{{ update.user.displayName }}</span>
                    </div>
                    <div v-for="(response, i) in update.responses" :key="response._id" class="text item">
                        {{ update.questions[i].updateLabel }} : {{ response.text }}
                    </div>
                </el-card>
            </el-col>
        </transition-group>
      </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Updates',
  data() {
    return { 
      updates: [],
      filter: '',
      loading: false,
      index: 1
    }
  },
  created: function() {
    this.getUpdates();
  },
  methods: {
    shuffle() {
        this.updates = this.updates.sort((a, b) => a._id < b._id)
    },
    getUpdates() {
      this.loading = true;
      return axios.get('http://165.227.161.43/api/v1/update?populate=[{"path":"user"},{"path":"responses"},{"path":"questions"}]').then(({data}) => {
        this.updates = data;
        this.loading = false;
      })
    }
  },
  computed: {
      filteredUpdates() {
          return this.updates.filter(update => this.filter.length ? update.user.displayName.includes(this.filter) : true)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
hr {
  background-color: #e6e6e6;
  border: 0;
  height: 1px;
  margin: 20px 0;
}

.flip-list-move {
  transition: transform 1s;
}
</style>
