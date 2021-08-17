<template>
  <router-view></router-view>
</template>

<style lang="sass">
.separator
  display: flex
  align-items: center
  text-align: center
  &::before, &::after
    content: ''
    flex: 1
    border-bottom: 1px solid #eee
  &::before
    margin-right: 8px
  &::after
    margin-left: 8px

.relative
  position: relative
</style>