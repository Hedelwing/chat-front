<template>
  <app-layot>
    <template v-slot:header>
      <v-toolbar-title>Пользователи</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <v-text-field
          dense
          outlined
          hide-details
          color="deep-purple"
          v-model="search"
          append-icon="mdi-magnify"
        ></v-text-field>
      </div>
    </template>
    <v-list v-if="users.length">
      <v-list-item v-for="user in users" :key="user.id">
        <v-badge
          bottom
          :value="user.isOnline"
          color="green"
          bordered
          dot
          offset-x="24"
          offset-y="16"
        >
          <v-list-item-avatar>
            <v-img :src="user.avatar"></v-img>
          </v-list-item-avatar>
        </v-badge>
        <v-list-item-content>
          <v-list-item-title v-text="user.nickname"></v-list-item-title>
          <v-list-item-subtitle v-text="user.email"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <small v-if="user.areRequestedFriendship" class="caption">
            Запрос был отправлен
          </small>
          <div v-else-if="user.areRequesterFriendship">
            <v-btn
              class="white--text"
              small
              @click.once="() => acceptFriendship(user.id)"
              color="deep-purple"
            >
              Принять
            </v-btn>
            <v-btn
              small
              class="ml-2"
              @click.once="() => denyFriendship(user.id)"
              color="deep-purple lighten-5"
            >
              Отказать
            </v-btn>
          </div>
          <v-btn
            v-else-if="!user.areFriends"
            small
            @click.once="() => sendFriendshipRequest(user.id)"
            color="deep-purple lighten-5"
          >
            Добавить
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div v-else-if="$apollo.queries.users.loading">
      <v-skeleton-loader
        v-for="i in 10"
        :key="i"
        type="list-item-avatar-two-line"
      ></v-skeleton-loader>
    </div>
  </app-layot>
</template>

<script>
import users from "../graphql/Users";
import friendshipRequest from "../graphql/FriendshipRequest";
import friendshipRequestActions from "../mixins/friendshipRequestActions";
import AppLayot from "../components/AppLayot.vue";
import { setIn, updateById, updateStore } from "../utils";

export default {
  components: {
    AppLayot,
  },
  data() {
    return {
      users: [],
      search: "",
    };
  },
  mixins: [friendshipRequestActions],
  methods: {
    sendFriendshipRequest(user) {
      this.$apollo.mutate({
        mutation: friendshipRequest,
        variables: {
          user,
        },
        update(store, { data }) {
          const updateUsers = (
            data,
            { sendFriendshipRequest: { requested } }
          ) =>
            setIn(data, "users", updateById(data.users, requested.id, requested));

          updateStore(
            store,
            {
              query: users,
            },
            data,
            updateUsers
          );
        },
      });
    },
  },
  apollo: {
    users: {
      query: users,
      variables() {
        return {
          searched: this.search,
        };
      },
    },
  },
};
</script>