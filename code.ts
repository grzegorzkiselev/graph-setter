figma.showUI(__html__);

figma.loadFontAsync({ family: "IBM Plex Sans Condensed", style: "Regular" })

figma.ui.onmessage = msg => {
  const nValues = msg.nValues.split(" ")
  .filter(value => value != "")
  .map(value => {
      const number = parseFloat(value.replace(",", "."))
      return number
  })
  const tValues = msg.tValues.split(" ")
  .filter(value => value != "")
  .map(value => {
      const number = parseFloat(value.replace(",", "."))
      return number
  })
  const lineChartHeight = parseFloat(msg.lineChartHeight)
  const valueOffset = Math.abs(parseInt(msg.valueOffset))
  const barHeight = parseFloat(msg.barHeight)
  const barThreshold = parseFloat(msg.barThreshold)

  console.log(barThreshold)
  
  const selection = figma.currentPage.selection[0]
  
  const lineValues = selection.findAll(n => n.name === "line-value")
  const barValues = selection.findAll(n => n.name === "bar-value")
  const lineValuePositions = selection.findAll(n => n.name === "line-value-position")
  const vectorParent = selection.findOne(n => n.name === "line-wrapper")
  const bars = selection.findAll(n => n.name === "bar")

  if (tValues.length > 0 && tValues.length !== barValues.length
    || nValues.length > 0 && nValues.length !== nValues.length) {
      figma.notify("Not equal length", { error: true })
      return
  }

  if (nValues.length > 1 && lineValues.length > 0) {
    lineValues.forEach((findedNode, index) => {
      const currentValue = nValues[index]
      findedNode.characters = currentValue + ""
    })
  }

  if (nValues.length > 1 && vectorParent != null) {
    const vector = vectorParent.children[0]
    var vClone = JSON.parse(JSON.stringify(vector.vectorNetwork))

    const maxLineChartValue = Math.max(...nValues)
    const lineCoef = maxLineChartValue / lineChartHeight
    
    vClone.vertices.sort((a, b) => {
      return a.x - b.x
    });
    
    vClone.vertices.forEach((point, index) => {
      const currentY = lineChartHeight - (nValues[index] / lineCoef)
      point.y = currentY
      lineValuePositions[index].y = currentY - valueOffset
    })

    vector.vectorNetwork = vClone
  }

  if (tValues.length > 1 && barValues.length > 0) {
    const maxBarValue = Math.max(...tValues)
    const barCoef = maxBarValue / barHeight

    bars.forEach((bar, index) => {
      const wrapper = bar.findOne(n => n.name === "wrapper")
      const barValue = wrapper.findOne(n => n.name === "bar-value")
      
      const currentValue = tValues[index]
      const currentHeight = (currentValue / barCoef) > 0.01 
        ? (currentValue / barCoef)
        : 1

      bar.resize(bar.absoluteBoundingBox.width, currentHeight)

      if (currentHeight <= barThreshold) {
        wrapper.primaryAxisAlignItems = 'MAX'
        wrapper.counterAxisAlignItems = 'MAX'
      } else {
        wrapper.primaryAxisAlignItems = "CENTER"
        wrapper.counterAxisAlignItems = "CENTER"
      }
      
      barValue.characters = currentValue + ""
    })
  }
};