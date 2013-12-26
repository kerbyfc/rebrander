$.fn.rebrand = (options) ->
  if SVG isnt undefined and SVG.supported
    new Rebrander(this, options)

class Rebrander

  defaults:
    max: 200
    min: 100
    red: 156
    green: 191
    blue: 144
    interval: 200
    delta: 1
    zindex: 10
    type: 'linear'

  colors: ['red', 'green', 'blue']

  mapping:
    red: ['green', 'blue']
    blue: ['red', 'green']
    green: ['red', 'blue']

  constructor: (@el, options = {}) ->

    @id = @el.attr('id')
    @src = @el.attr('src')

    @el.hide()

    unless el.is('img') and @id
      return console?.log? "Rebrander works with img tags with id"

    @options = {}
    for key, val of @defaults
      @options[key] = if typeof(options[key]) is typeof(@defaults[key])
        options[key]
      else
        @defaults[key]

    @setup()

    @img = new Image()
    @img.onload = =>
      @render @img
    @img.src = @src

  setup: ->
    if (@options.delta%2) > 0
      @options.delta++
    for col in @colors
      @options[col] = @options.min if @options[col] < @options.min
      @options[col] = @options.max if @options[col] > @options.max

  render: (img) ->
    @width = @el.width()
    unless @height
      @scale = @width / @img.width
      @height = parseInt @img.height * @scale
    @replace()
    @start()

  replace: ->
    @hid = @id + '_rebrander'
    @holder = $('<div>').attr(id: @hid).css
      width: @width
      height: @height
      "z-index": @options.zindex
    @el.replaceWith @holder
    @holder.on 'click', =>
      console?.log? @options.red, @options.green, @options.blue

  start: ->
    @draw = SVG @hid
    @rect = @draw.rect().size(@width, @height).fill('none')
    @mask = @draw.image(@src).size @width, @height
    @colorize()
    setInterval @colorize, @options.interval

  color: (val) ->
    color = @colors[@cur]
    unless val
      @options[color]
    else
      @options[color] = val

  colorize: =>
    unless @cur?
      @cur = 0
    if @color() >= @options.max
      @cur = if @cur is 2 then 0 else @cur + 1
    else
      @color( @color() + @options.delta )
      for col in @mapping[@colors[@cur]]
        if @options[col] > @options.min
          @options[col] = @options[col] - (@options.delta/2)

    gradient = @draw.gradient @options.type, (stop) =>
      stop.at
       offset: 0
       color:
        r: @options.red
        g: @options.green
        b: @options.blue
      stop.at
        offset: 1
        color:
          r: @options.blue
          g: @options.red
          b: @options.green
    @rect.fill
      color: gradient

    @rect.maskWith(@mask)

  shift: (arr) ->
    l = arr.length
    arr.unshift(arr[arr.length-1]);
    arr.length = l;
    arr