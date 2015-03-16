#script
nodyjs_o    = File.expand_path("../../nody.js", __FILE__)
nodyjs_t    = File.expand_path("../../../test/Mixture/resources/js/nody.js", __FILE__)
nodyminjs_o = File.expand_path("../../../dist/nody.min.js", __FILE__)
nodyminjs_t = File.expand_path("../../../test/Mixture/resources/js/nody.min.js", __FILE__)
cp_1 = "cp #{nodyjs_o} #{nodyjs_t}"
cp_2 = "cp #{nodyminjs_o} #{nodyminjs_t}"

puts cp_1
`#{cp_1}`
puts cp_2
`#{cp_2}`


#css
nodykit_o = File.expand_path("../../scss-kit/_nody-kit.scss", __FILE__)
nodykit_t = File.expand_path("../../../test/Mixture/resources/scss/_nody-kit.scss", __FILE__)
nodycss_o = File.expand_path("../../scss-kit/nody.css", __FILE__)
nodycss_t = File.expand_path("../../../test/Mixture/resources/css/nody.css", __FILE__)

cp_3 = "cp #{nodykit_o} #{nodykit_t}"
cp_4 = "cp #{nodycss_o} #{nodycss_t}"

puts cp_3
`#{cp_3}`
puts cp_4
`#{cp_4}`