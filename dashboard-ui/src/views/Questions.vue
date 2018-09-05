<template>
  <div >
      <h1>Questions</h1>
      <hr/>

        <el-table
        :default-sort = "{prop: 'order', order: 'ascending'}"
    :data="questions"
    v-loading="loading"
    stripe
    style="width: 100%">
    <el-table-column
      prop="order"
      label="Order"
      width="90">
    </el-table-column>
    <el-table-column
      prop="text"
      label="Text"
      width="320">
    </el-table-column>
        <el-table-column
      prop="updateLabel"
      label="Update label"
      width="120">
    </el-table-column>
    <el-table-column
      prop="days"
      label="Days"
      width="280">
            <template slot-scope="scope">
        <span v-for="day in Object.keys(weekDays)" :key="day" class="weekday" :class="{active: scope.row.days.includes(day)}">{{ day }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="color"
      label="Color" width="70">
      <template slot-scope="scope">
       <div class="colorSwatch" :style="{backgroundColor: scope.row.color}"></div>
      </template>
    </el-table-column>
    <el-table-column
      label="Operations"
      width="180">
      <template slot-scope="scope">

                <el-button     size="mini"  icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>

                          <el-button         size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>

<el-card v-if="formQuestion" class="box-card">
  <div slot="header" class="clearfix">
    <span>Create question</span>
  </div>
 <el-form >

        <el-form-item label="Order">
           <el-input-number v-model="formQuestion.order" :min="1" :max="100"></el-input-number>
        </el-form-item>

        <el-form-item label="Text">
          <el-input v-model="formQuestion.text" placeholder="Question text"/>
        </el-form-item>

        <el-form-item label="Response label">
          <el-input v-model="formQuestion.updateLabel" placeholder="Response lavel"/>
        </el-form-item>

        <el-form-item label="Days">
          <el-checkbox-group v-model="formQuestion.days">
            <el-checkbox v-for="day of Object.keys(weekDays)"
            :key="day"
            :name="day"
            :label="day"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Response color">
          <el-color-picker v-model="formQuestion.color"></el-color-picker>
        </el-form-item>

      </el-form>
      <el-button v-if="formQuestion" type="info" icon="el-icon-close" circle @click="handleCancel"></el-button>
       <el-button v-if="formQuestion && !formQuestion._id" type="success" circle icon="el-icon-check" @click="create"></el-button>
      <el-button v-if="formQuestion && formQuestion._id" type="primary" circle icon="el-icon-check" @click="save"></el-button>
</el-card>

     
      <hr/>
      <el-button v-if="!formQuestion" type="success" icon="el-icon-plus" circle @click="handleNew"></el-button>
  </div>
</template>

<script>
import axios from 'axios'
import { labeledStatement } from 'babel-types';

export default {
  name: 'Questions',
  data() {
    return {
      loading: false, 
      questions: [], 
      formQuestion: null,
      weekDays: {
        'Sun': 0,
        'Mon': 1,
        'Tue': 2,
        'Wed': 3,
        'Thu': 4,
        'Fri': 5,
        'Sat': 6
      }
    }
  },
  created: function() {
    this.get();
  },
  methods: {
    handleCancel() {
      this.formQuestion = null;
    },
    handleNew() {
      this.formQuestion = { order: 0, text: '', updateLabel: '', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
    },
    handleEdit(index, question) {
      this.formQuestion = {...question};
    },
    handleDelete(index, question) {
      this.delete(question);
    },
    get() {
      this.loading = true;
      axios.get('http://165.227.161.43/api/v1/question').then(({data}) => {
        this.questions = data.map(question => {
          return {
            ...question,
            days: question.days.map(n => Object.keys(this.weekDays)[n])
          }
        })
        this.loading = false;
      })
    },
    create() {
      this.loading = true;
      axios.post('http://165.227.161.43:3000/api/v1/question', {
        ...this.formQuestion, 
        days: this.parseWeekDays(this.formQuestion.days)
      }).then(({data}) => {
        this.formQuestion = null;
        this.get();
      })
    },
    save() {
      this.loading = true;
      axios.put(`http://165.227.161.43:3000/api/v1/question/${this.formQuestion._id}`, {
        ...this.formQuestion, 
        days: this.parseWeekDays(this.formQuestion.days)
      }).then(({data}) => {
        this.formQuestion = null;
        this.get();
      })
    },
    delete(question) {
      this.loading = true;
      axios.delete(`http://165.227.161.43:3000/api/v1/question/${question._id}`, {
      }).then(({data}) => {
        this.loading = false;
        this.get();
      })
    },
    parseWeekDays(days) {
      return days.map(day => this.weekDays[day])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.weekday {
  font-size: 12px;
  color: #ccc;
  margin-right: 10px;

  &.active {
    color: #555;
    font-weight: bold;
  }
}

.colorSwatch {
  width: 16px;
  height: 16px;
  border-radius: 8px;
  border: 2px solid #ddd;
}

hr {
  background-color: #e6e6e6;
  border: 0;
  height: 1px;
  margin: 20px 0;
}
</style>
