<template>
  <div class="hello">
      <h1>Users</h1>
      <template>
        <el-transfer
          v-loading="loading"
          filterable
          v-model="users"
          :data="members"
          filter-placeholder="Search by name"
          @change="handleChange"

          :titles="['Slack members', 'Dailydroid users']">
        </el-transfer>
        <hr/>
          <el-button 
          v-if="dirty" 
          type="info"
          icon="el-icon-refresh" 
          @click="resetChanges">
            Reset
          </el-button>
         <el-button 
          v-if="dirty" 
          type="success"
          icon="el-icon-check" 
          @click="commitChanges">
            Commit changes
          </el-button>
      </template>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Users',
  data() {
    return { 
      members: [],
      users: [],
      initialUsers: [],
      userData: [],
      loading: false,
      dirty: false
    }
  },
  created: function() {
    this.getUserList();
    this.getSlackMemberList();
  },
  methods: {
    resetChanges() {
      this.dirty = false;
      this.getUserList();
      this.getSlackMemberList();
    },
    commitChanges() {
      this.dirty = false;
      this.users.filter(user => !this.initialUsers.includes(user)).forEach(this.registerUser)
      this.initialUsers.filter(user => !this.users.includes(user)).forEach(this.removeUser)
    },
    handleChange(e) {
      this.dirty = true;
    },
    getSlackMemberList() {
      this.loading = true;
      return axios.get('http://165.227.161.43:3000/api/v1/user-list').then(({data}) => {
        this.members = data.members
          .filter(member => !member.is_bot && member.name !== 'slackbot')
          .map((member, i) => ({
            label: member.profile.display_name,
            key: member.id,
            disabled: false
          }))
        this.loading = false;
      })
    },
    getUserList() {
      this.loading = true;
      return axios.get('http://165.227.161.43:3000/api/v1/user').then(({data}) => {
        this.userData = data;
        this.users = data.map((user, i) => user.platformId);
        this.initialUsers = [...this.users]
        this.loading = false;
      })
    },
    registerUser(user) {
      this.loading = true;
      axios.post('http://165.227.161.43:3000/api/v1/user-register', {user}).then(() => {
        this.getUserList();
      })
    },
    removeUser(user) {
      this.loading = true;
      const userId = this.userData.find(userObj => userObj.platformId === user)._id
      axios.delete(`http://165.227.161.43:3000/api/v1/user/${userId}`).then(() => {
        this.getUserList();
      })
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
</style>
