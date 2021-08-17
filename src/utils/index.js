import { format } from 'date-fns'
import { clone, setWith } from 'lodash'
import { cache } from '../cache'

export const dateGetters = date => ({
  get unix() {
    return date
  },
  get time() {
    return format(date, 'HH:mm:ss')
  },
  get date() {
    return format(date, 'dd.MM.yyyy')
  }
})

export const isLoggedIn = () => 'token' in localStorage

export const login = (token) => {
  localStorage.setItem('token', token)
}

export const logout = () => {
  localStorage.removeItem('token')
  cache.restore()
}

/**  
 * Update store query
 * @param {object} store
 * @param {object} query
 * @param {any} updateData
 * @param {function} modifyFn
**/

export const updateStore = (store, query, updateData, modifyFn) => {
  try {
    const data = store.readQuery(query)

    const newData = modifyFn(data, updateData)

    store.writeQuery({ ...query, data: newData })

    return newData
  }
  catch (e) {
    console.error("updateStore:", e)
  }
}


/**  
 * Remove from collection and returns as new collection
 * @param {array} collection
 * @param {string} id
 * @returns {array}
**/

export const removeById = (arr, id) =>
  arr.filter(item =>
    item.id.toLowerCase().toString() !== id.toLowerCase().toString()
  )


/**  
 * Update collection and returns as new collection
 * @param {array} collection
 * @param {string} id
 * @param {any} updated
 * @returns {array}
**/

export const updateById = (collection, id, updated) =>
  collection.map(item =>
    item.id.toString().toLowerCase() !== id.toString().toLowerCase() ? item : { ...item, ...updated }
  )

/**  
* Add into collection start and returns as new collection
* @param {array} collection
* @param {any} item
* @returns {array}
**/

export const unshift = (collection, item) => [item, ...collection]


/**  
* Immutable implementation of set from lodash
* @param {object} obj
* @param {string} path
* @param {any} value
* @returns {object}
**/

export const setIn = (obj, path, value) => setWith(clone(obj), path, value, clone)
