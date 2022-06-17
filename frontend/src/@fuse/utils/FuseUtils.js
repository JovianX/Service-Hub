// eslint-disable-next-line max-classes-per-file
import _ from '@lodash';
import * as colors from '@mui/material/colors';

class EventEmitter {
  constructor() {
    this.events = {};
  }

  _getEventListByName(eventName) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set();
    }
    return this.events[eventName];
  }

  on(eventName, fn) {
    this._getEventListByName(eventName).add(fn);
  }

  once(eventName, fn) {
    const self = this;

    const onceFn = (...args) => {
      self.removeListener(eventName, onceFn);
      fn.apply(self, args);
    };
    this.on(eventName, onceFn);
  }

  emit(eventName, ...args) {
    this._getEventListByName(eventName).forEach(
      // eslint-disable-next-line func-names
      function (fn) {
        fn.apply(this, args);
      }.bind(this)
    );
  }

  removeListener(eventName, fn) {
    this._getEventListByName(eventName).delete(fn);
  }
}

class FuseUtils {
  static filterArrayByString(mainArr, searchText) {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter((itemObj) => this.searchInObj(itemObj, searchText));
  }

  static searchInObj(itemObj, searchText) {
    if (!itemObj) {
      return false;
    }

    const propArray = Object.keys(itemObj);

    for (let i = 0; i < propArray.length; i += 1) {
      const prop = propArray[i];
      const value = itemObj[prop];

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
    return false;
  }

  static searchInArray(arr, searchText) {
    arr.forEach((value) => {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
      return false;
    });
    return false;
  }

  static searchInString(value, searchText) {
    return value.toLowerCase().includes(searchText);
  }

  static generateGUID() {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }

  static toggleInArray(item, array) {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  static handleize(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/\W+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  static setRoutes(config, defaultAuth) {
    let routes = [...config.routes];

    routes = routes.map((route) => {
      let auth = config.auth || config.auth === null ? config.auth : defaultAuth || null;
      auth = route.auth || route.auth === null ? route.auth : auth;
      const settings = _.merge({}, config.settings, route.settings);

      return {
        ...route,
        settings,
        auth,
      };
    });

    return [...routes];
  }

  static generateRoutesFromConfigs(configs, defaultAuth) {
    let allRoutes = [];
    configs.forEach((config) => {
      allRoutes = [...allRoutes, ...this.setRoutes(config, defaultAuth)];
    });
    return allRoutes;
  }

  static findById(obj, id) {
    let i;
    let childObj;
    let result;

    if (id === obj.id) {
      return obj;
    }

    for (i = 0; i < Object.keys(obj).length; i += 1) {
      childObj = obj[Object.keys(obj)[i]];

      if (typeof childObj === 'object') {
        result = this.findById(childObj, id);
        if (result) {
          return result;
        }
      }
    }
    return false;
  }

  static getFlatNavigation(navigationItems, flatNavigation = []) {
    for (let i = 0; i < navigationItems.length; i += 1) {
      const navItem = navigationItems[i];

      if (navItem.type === 'item') {
        flatNavigation.push({
          id: navItem.id,
          title: navItem.title,
          type: navItem.type,
          icon: navItem.icon || false,
          url: navItem.url,
          auth: navItem.auth || null,
        });
      }

      if (navItem.type === 'collapse' || navItem.type === 'group') {
        if (navItem.children) {
          this.getFlatNavigation(navItem.children, flatNavigation);
        }
      }
    }
    return flatNavigation;
  }

  static randomMatColor(hue) {
    hue = hue || '400';
    const mainColors = [
      'red',
      'pink',
      'purple',
      'deepPurple',
      'indigo',
      'blue',
      'lightBlue',
      'cyan',
      'teal',
      'green',
      'lightGreen',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deepOrange',
    ];
    const randomColor = mainColors[Math.floor(Math.random() * mainColors.length)];
    return colors[randomColor][hue];
  }

  static difference(object, base) {
    function changes(_object, _base) {
      return _.transform(_object, (result, value, key) => {
        if (!_.isEqual(value, _base[key])) {
          result[key] =
            _.isObject(value) && _.isObject(_base[key]) ? changes(value, _base[key]) : value;
        }
      });
    }

    return changes(object, base);
  }

  static EventEmitter = EventEmitter;

  static updateNavItem(nav, id, item) {
    return nav.map((_item) => {
      if (_item.id === id) {
        return _.merge({}, _item, item);
      }

      if (_item.children) {
        return _.merge({}, _item, {
          children: this.updateNavItem(_item.children, id, item),
        });
      }

      return _.merge({}, _item);
    });
  }

  static removeNavItem(nav, id) {
    return nav
      .map((_item) => {
        if (_item.id === id) {
          return null;
        }

        if (_item.children) {
          return _.merge({}, _.omit(_item, ['children']), {
            children: this.removeNavItem(_item.children, id),
          });
        }

        return _.merge({}, _item);
      })
      .filter((s) => s);
  }

  static prependNavItem(nav, item, parentId) {
    if (!parentId) {
      return [item, ...nav];
    }

    return nav.map((_item) => {
      if (_item.id === parentId && _item.children) {
        return {
          ..._item,
          children: [item, ..._item.children],
        };
      }

      if (_item.children) {
        return _.merge({}, _item, {
          children: this.prependNavItem(_item.children, item, parentId),
        });
      }

      return _.merge({}, _item);
    });
  }

  static appendNavItem(nav, item, parentId) {
    if (!parentId) {
      return [...nav, item];
    }

    return nav.map((_item) => {
      if (_item.id === parentId && _item.children) {
        return {
          ..._item,
          children: [..._item.children, item],
        };
      }

      if (_item.children) {
        return _.merge({}, _item, {
          children: this.appendNavItem(_item.children, item, parentId),
        });
      }

      return _.merge({}, _item);
    });
  }

  static hasPermission(authArr, userRole) {
    /**
     * If auth array is not defined
     * Pass and allow
     */
    if (authArr === null || authArr === undefined) {
      // console.info("auth is null || undefined:", authArr);
      return true;
    }
    if (authArr.length === 0) {
      /**
       * if auth array is empty means,
       * allow only user role is guest (null or empty[])
       */
      // console.info("auth is empty[]:", authArr);
      return !userRole || userRole.length === 0;
    }
    /**
     * Check if user has grants
     */
    // console.info("auth arr:", authArr);
    /*
            Check if user role is array,
            */
    if (userRole && Array.isArray(userRole)) {
      return authArr.some((r) => userRole.indexOf(r) >= 0);
    }

    /*
            Check if user role is string,
            */
    return authArr.includes(userRole);
  }

  static filterRecursive(data, predicate) {
    // if no data is sent in, return null, otherwise transform the data
    return !data
      ? null
      : data.reduce((list, entry) => {
          let clone = null;
          if (predicate(entry)) {
            // if the object matches the filter, clone it as it is
            clone = { ...entry };
          }
          if (entry.children != null) {
            // if the object has childrens, filter the list of children
            const children = this.filterRecursive(entry.children, predicate);
            if (children.length > 0) {
              // if any of the children matches, clone the parent object, overwrite
              // the children list with the filtered list
              clone = { ...entry, children };
            }
          }

          // if there's a cloned object, push it to the output list
          if (clone) {
            list.push(clone);
          }
          return list;
        }, []);
  }
}

export default FuseUtils;
