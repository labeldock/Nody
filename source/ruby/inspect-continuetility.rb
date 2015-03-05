@nodyjs_path = File.expand_path('../nody.js', __FILE__)
@nodyjs_file = File.open @nodyjs_path, 'r'


@continuetility = []

while (line = @nodyjs_file.gets)
  if line.match 'CONTINUEFUNCTION'
    @continuetility << (line.strip.match /\"([\w]+)\"/)[1]
  end
end


puts @continuetility

