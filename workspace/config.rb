###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
page "/*.html", :layout => :nody_layout
page "/oldpage/*.html", :layout => :oldpage_layout
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (https://middlemanapp.com/advanced/dynamic_pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end
# Methods defined in the helpers block are available in templates
helpers do
    #relative path absolute
    def rpa path; ('../' * (current_page.path.count('/')+1)) + (path.match(/^\//) ? path[1..-1] : path); end
end

#set :css_dir, 'stylesheets'
#
#set :js_dir, 'javascripts'
#
#set :images_dir, 'images'

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end

#nody to dist
after_build do |builder|
    nody_source_path = File.expand_path('source/resources/js/nody.js',Dir.pwd)
    nody_build_path  = File.expand_path('build/resources/js/nody.js',Dir.pwd)
    FileUtils.cp nody_source_path, File.expand_path('../dist/nody.js',Dir.pwd)
    FileUtils.cp nody_build_path, File.expand_path('../dist/nody.min.js',Dir.pwd)
end
