<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm8>
          <h3>User Datatable</h3>
        </v-flex>
        <v-flex sm4>
          <v-btn color="darken-2" @click="openUserForm()">Add New User</v-btn>
        </v-flex>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                placeholder="Type something"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>
              <v-btn icon>
                <v-icon>filter_list</v-icon>
              </v-btn>
              <v-menu
                offset-y
                origin="center center"
                :nudge-right="140"
                :nudge-bottom="10"
                transition="scale-transition"
              >
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list id="context_menu">
                  <template v-for="(column, index) in complex.columnsVisible">
                    <v-list-tile :key="index">
                      <v-list-tile-content>
                        <v-checkbox
                          primary
                          v-model="complex.columnsSelected"
                          :label="column"
                          :value="column"
                        ></v-checkbox>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="computedHeaders"
                :items="complex.items"
                class="elevation-1"
                hide-actions
                must-sort
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.index + 1 }}</td>
                  <td v-if="complex.columnsSelected.indexOf('Firstname') != -1">{{ props.item.firstname }}</td>
                  <td v-if="complex.columnsSelected.indexOf('Lastname') != -1">{{ props.item.lastname }}</td>
                  <td v-if="complex.columnsSelected.indexOf('Age') != -1">{{ props.item.age }}</td>
                  <td v-if="complex.columnsSelected.indexOf('Address') != -1">{{ props.item.address.full }}</td>
                  <td v-if="complex.columnsSelected.indexOf('Email') != -1">{{ props.item.email }}</td>
                  <td v-if="complex.columnsSelected.indexOf('Phone') != -1">{{ props.item.phone }}</td>
                  <td>
                    <v-btn depressed outline icon fab dark color="primary" small @click="onEdit(props.item.uuid)">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn depressed outline icon fab dark color="pink" small>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-if="loading" row wrap align-center justify-center ma-0 pb-4>
        <v-progress-circular :size="40" color="primary" indeterminate ma-auto></v-progress-circular>
      </v-layout>
    </v-container>
    <user-form></user-form>
  </div>
</template>

<script>
import UserForm from "@/components/UserForm";
import UserAPI from "@/api/users";

export default {
  components: {
    UserForm
  },
  data() {
    return {
      search: "",
      searchFilter: {
        offset: 0
      },
      pagination: {
        offset: 0,
        limit: 10,
        end: false
      },
      bottom: false,
      loading: false,
      mounted: false,
      complex: {
        columnsVisible: [
          "Firstname",
          "Lastname",
          "Age",
          "Address",
          "Email",
          "Phone"
        ],
        columnsSelected: [],
        headers: [
          {
            text: "№",
            align: "center",
            value: "serial",
            sortable: false,
            width: "3%"
          },
          {
            text: "Firstname",
            value: "firstname"
          },
          {
            text: "Lastname",
            value: "lastname"
          },
          {
            text: "Age",
            value: "age"
          },
          {
            text: "Address",
            value: "address.full"
          },
          {
            text: "Email",
            value: "email"
          },
          {
            text: "Phone",
            value: "phone"
          },
          {
            text: "Action",
            value: "",
            sortable: false
          }
        ],
        items: []
      }
    };
  },
  created() {
    this.fetchUsers();
  },
  mounted() {
    this.mounted = true;
    (this.complex.columnsSelected = [...this.complex.columnsVisible]),
      window.addEventListener("scroll", () => {
        this.bottom = this.bottomVisible();
      });
  },
  methods: {
    async fetchUsers() {
      if (!this.pagination.end && !this.loading) {
        this.loading = true;
        const finded = await UserAPI.getUsers(
          this.pagination.offset,
          this.pagination.limit
        );
        if (finded.length) {
          this.complex.items = [...this.complex.items, ...finded]; // join
          this.pagination.offset =
            this.pagination.offset + this.pagination.limit;
        } else {
          this.pagination.end = true;
        }
        this.loading = !this.loading;
      }
    },
    async searchBy(searchStr) {
      this.complex.items = [];
      if (!searchStr) return this.fetchUsers();
      const response = UserAPI.getUsersBySearch(
        searchStr,
        this.searchFilter.offset,
        this.pagination.limit
      );
      if (response.users.length) {
        this.complex.items = [...this.complex.items, ...response.users]; // join
        this.searchFilter.offset =
          this.searchFilter.offset + this.pagination.limit;
      }
    },
    onEdit(uuid) {
      this.openUserForm();
      this.$store.dispatch('FETCH_USER', uuid);
    },
    openUserForm() {
      this.$store.commit("TOGGLE_FORM");
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomPage = visible + scrollY >= pageHeight;
      return bottomPage || pageHeight < visible;
    }
  },
  computed: {
    computedHeaders() {
      return this.complex.headers.filter(head => {
        if (head.text === "№" || head.text === "Action") return true;
        return this.complex.columnsSelected.indexOf(head.text) != -1;
      });
    }
  },
  watch: {
    search(str) {
      this.pagination.offset = 0;
      this.pagination.end = false;
      this.searchFilter.offset = 0;
      this.searchBy(str);
    },
    bottom(bottom) {
      if (bottom) {
        if (!this.pagination.end && !this.search) this.fetchUsers();
      }
    }
  }
};
</script>
