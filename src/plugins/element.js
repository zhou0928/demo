import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Row,
  Col,
  Menu,
  MenuItem,
  Submenu,
  RadioGroup,
  RadioButton,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Tag,
  Pagination,
  Switch,
  Tooltip,
  Dialog,
  MessageBox,
  Tree,
  Select,
  Option, Cascader, Alert, Tabs, TabPane, Steps, Step, Checkbox, CheckboxGroup, Upload
} from 'element-ui'
import upload from "element-ui/packages/upload/src/ajax";

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
