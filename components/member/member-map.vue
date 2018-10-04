<template>
  <div>
    <div id="memberMap"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: ['stops'],
    computed: mapState([
      'currentUser'
    ]),
    mounted: function () {
      let infoWindows = []
      let listenerInfoWindow
      const infoWindowListner = (info) => {
        google.maps.event.addListener(info, 'domready', function () {
          // Reference to the DIV which receives the contents of the infowindow using jQuery
          const iwOuter = $('.gm-style-iw')
          const iwBackground = iwOuter.prev()
          const iwCloseBtn = iwOuter.next()

          iwOuter.hide()
          iwCloseBtn.hide()
          iwBackground.hide()

          // Moves the infowindow 115px to the right.
          iwOuter.parent().parent().css({left: '-15px'})

          // Apply the desired effect to the close button
          iwCloseBtn.css({
            opacity: '1',
            right: '-7px',
            top: '40px',
          })

          iwOuter.fadeIn(300)
          iwCloseBtn.fadeIn(300)
        })
      }
      const createOneMarker = (memberName, name, time) => {
        return '<div class="name">' + memberName + '</div>' +
          '<div class="stop"><div class="stop-name">' + name + '</div>' +
          '<div class="date">' + time + '</div>' +
          '</div>'
      }
      const initMap = () => {

        const memberMap = new google.maps.Map(document.getElementById('memberMap'), {clickableIcons: false})

        let bounds = new google.maps.LatLngBounds()

        const markers = this.stops.map((stop, i) => {
          const marker = new google.maps.Marker({
            position: stop.location,
            icon: '/images/icons/map-marker.png',
            name: stop.name,
            memberName: stop.memberName,
            stopTime: this.$options.filters.date(stop.dateTimeCheckIn * 1000, 'DD.MM.YYYY HH:mm', this.currentUser.timeZone ? this.currentUser.timeZone.name : stop.dateTimeTimezoneName)
          })

          const infoWindow = new google.maps.InfoWindow({
            width: 190,
            maxWidth: 190,
            content: '<div class="map-stop-info">' + createOneMarker(marker.memberName, marker.name, marker.stopTime) + '</div>'
          })

          bounds.extend(marker.position)

          marker.addListener('click', () => {

            infoWindows.forEach((oneWindow, i) => {
              oneWindow.close()

              delete infoWindows[i]
            })
            google.maps.event.removeListener(listenerInfoWindow)
            infoWindows.push(infoWindow)
            infoWindow.open(memberMap, marker)
          })

          infoWindowListner(infoWindow)

          return marker
        })
        // Add a marker clusterer to manage the markers.
        const markerCluster = new MarkerClusterer(memberMap, markers,
          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})

        //now fit the map to the newly inclusive bounds
        memberMap.fitBounds(bounds)

        const listener = google.maps.event.addListener(memberMap, 'idle', function () {

          if (memberMap.getZoom() > 10) {
            memberMap.setZoom(10)
          }
          google.maps.event.removeListener(listener)
        })

        // Trigger the clusterclick event.
        google.maps.event.addListener(markerCluster, 'clusterclick', (cluster) => {
          if (memberMap.getZoom() >= 22) {
            const infoWindow = new google.maps.InfoWindow({
              width: 190,
              maxWidth: 190
            })
            const murkers = cluster.getMarkers()
            const array = []
            let num = 0

            for (let i = 0; i < murkers.length; i++) {
              num++
              array.push(createOneMarker(murkers[i].memberName, murkers[i].name, murkers[i].stopTime))
            }

            infoWindowListner(infoWindow)
            infoWindow.setContent('<div class="map-stop-info">' + array.join('') + '</div>')
            infoWindow.setPosition(cluster.getCenter())
            infoWindow.open(memberMap)
          }
        })
      }

      setTimeout(() => {
        initMap()
      }, 100)
    },
    name: 'member-map'
  }
</script>


<style lang="scss">
  @import '../../assets/scss/crew/map.scss';
</style>

