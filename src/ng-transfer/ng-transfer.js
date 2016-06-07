import tools from '../tools'
import './ng-transfer.scss'

class Ctrl {
    constructor($scope) {
        this.$scope = $scope
        $scope.ctrl = this

        this.initList()
        this.account  = tools.getAccount()
        this.NickName = this.account.NickName
        this.groups   = this.fetchGroups()
        this.tab      = this.groups.length ? 1 : 0
    }

    initList() {
        this.from = {
            items: angular.copy(tools.fetchAllContacts())
        }
        this.to   = {
            items: []
        }
    }

    transfer(fromItems, toItems) {
        for (var i = 0; i < fromItems.length; i++) {
            if (fromItems[i].checked) {
                fromItems[i].checked = false
                toItems.push(...fromItems.splice(i, 1))
                i--
            }
        }
    }

    hasSomeChecked(items) {
        return items && items.some((item) => item.checked)
    }

    filterFunc(expected) {
        return (item) => {
            if (!expected) return item

            let reg = new RegExp(expected, 'ig')
            return reg.test(item.RemarkName) || reg.test(item.NickName)
        }
    }

    saveGroups() {
        let name = prompt('给分组取个名字：')

        if (!name) return

        this.groups.unshift({
            name,
            id   : Date.now(),
            items: this.to.items.map((item) => {
                return {
                    NickName  : item.NickName,
                    RemarkName: item.RemarkName
                }
            })
        })

        this.writeGroups()
    }

    selectGroup(group) {
        this.initList()

        this.from.items.forEach((item) => {
            item.checked = group.some((groupItem) => item.RemarkName === groupItem.RemarkName || item.NickName === groupItem.NickName)
        })

        this.transfer(this.from.items, this.to.items)
        this.tab = 0
    }

    delGroup(group) {
        window.event.stopPropagation()
        window.event.preventDefault()

        this.groups = this.groups.filter((item) => item.id !== group.id)

        this.writeGroups()
    }


    fetchGroups() {
        return JSON.parse(localStorage[`groups_${this.NickName}`] || '[]')
    }

    writeGroups() {
        return localStorage[`groups_${this.NickName}`] = JSON.stringify(this.groups)
    }
}

Ctrl.$inject = ['$scope']


export default Ctrl