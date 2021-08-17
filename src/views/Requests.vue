<template>
  <app-layot>
    <template v-slot:header>
      <v-toolbar-title>Заявки в друзья</v-toolbar-title>
    </template>
    <v-list v-if="receivedRequests.length">
      <v-list-item v-for="{ id, requester } in receivedRequests" :key="id">
        <v-list-item-avatar>
          <v-img :src="requester.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="requester.nickname"></v-list-item-title>
          <v-list-item-subtitle v-text="requester.email"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action @click.once="() => acceptFriendship(requester.id)">
          <v-btn icon color="green">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn icon color="red" @click.once="() => denyFriendship(requester.id)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div v-else>
      <p class="mt-3 text-center text-secondary caption">Нет заявок</p>
    </div>
  </app-layot>
</template>

<script>
import AppLayot from "../components/AppLayot.vue";
import receivedRequests from "../graphql/ReceivedRequests";
import friendshipRequestActions from "../mixins/friendshipRequestActions";

export default {
  components: { AppLayot },
  mixins: [friendshipRequestActions],
  data() {
    return {
      receivedRequests: [],
    };
  },
  apollo: {
    receivedRequests: {
      query: receivedRequests,
    },
  },
};
</script>