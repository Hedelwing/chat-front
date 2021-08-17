  <template>
  <v-app>
    <v-navigation-drawer
      :permanent="$vuetify.breakpoint.smAndUp"
      v-model="drawer"
      dark
      app
    >
      <user-info></user-info>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item link to="/users">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Пользователи</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/friends">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Друзья</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/requests">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Заявки в друзья</v-list-item-title>
          <v-list-item-icon>
            <v-badge
              color="grey darken-1"
              v-if="receivedRequests"
              :value="receivedRequests.length"
              :content="receivedRequests.length"
              inline
            ></v-badge>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link to="/chats">
          <v-list-item-icon>
            <v-icon>mdi-chat</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Чаты</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container
        class="white pa-0 relative d-flex flex-column"
        style="min-height: 100vh"
      >
        <v-app-bar
          flat
          style="
            background: white;
            position: sticky;
            top: 0;
            z-index: 5;
            flex-grow: 0;
            border-bottom: 1px solid #e0e0e0;
          "
        >
          <v-app-bar-nav-icon
            :class="{ 'd-none': $vuetify.breakpoint.smAndUp }"
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <slot name="header"></slot>
        </v-app-bar>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import UserInfo from "./UserInfo.vue";
import ReceivedRequests from "../graphql/ReceivedRequests";

export default {
  name: "App",
  data() {
    return {
      drawer: false,
      receivedRequests: null,
    };
  },
  components: {
    UserInfo,
  },
  apollo: {
    receivedRequests: { query: ReceivedRequests },
  },
};
</script>