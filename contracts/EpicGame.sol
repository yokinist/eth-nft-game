// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

import "./libs/Base64.sol";

contract EpicGame is ERC721 {
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    struct BigBoss {
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }
    BigBoss public bigBoss;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    CharacterAttributes[] defaultCharacters;

    // NFTの tokenId / CharacterAttributes
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    // ユーザーのアドレス / NFT の tokenId
    mapping(address => uint256) public nftHolders;

    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);

    event AttackComplete(uint newBossHp, uint newPlayerHp);

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint bossHp,
        uint bossAttackDamage
    )

    ERC721("Pokemons", "POKEMON")
    {
        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });
        console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

        // 全キャラクターに付与されるデフォルト値をコントラクトに保存
        for(uint i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(CharacterAttributes({
                characterIndex: i,
                name: characterNames[i],
                imageURI: characterImageURIs[i],
                hp: characterHp[i],
                maxHp: characterHp[i],
                attackDamage: characterAttackDmg[i]
            }));
            CharacterAttributes memory character = defaultCharacters[i];
            console.log("Done initializing %s w/ HP %s, img %s", character.name, character.hp, character.imageURI);
            _tokenIds.increment();
        }
    }

    function mintCharacterNFT(uint _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        // NFT をユーザーに Mint
        _safeMint(msg.sender, newItemId);

        // mapping で定義した tokenId を CharacterAttributes に紐づける
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    // nftHolderAttributes を更新して、tokenURI を添付する関数を作成
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
        // charAttributes のデータ編集して、JSON の構造に合わせた変数に格納
        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

        string memory json = Base64.encode(
            // abi.encodePacked で文字列を結合します。
            // OpenSeaが採用するJSONデータをフォーマット
            abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,'} ]}'
            )
        );
        // 文字列 data:application/json;base64, と json の中身を結合して、tokenURI を作成しています。
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }


    function attackBoss() public {
        // 1. プレイヤーのNFTの状態を取得します。
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
        console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

        // 2. プレイヤーのHPが0以上であることを確認
        require (
            player.hp > 0,
            "Error: character must have HP to attack boss."
        );

        // 3. ボスのHPが0以上であることを確認
        require (
            bigBoss.hp > 0,
            "Error: boss must have HP to attack boss."
        );

        // 4. プレイヤーがボスを攻撃できるようにする
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        }

        // 5. ボスがプレイヤーを攻撃できるようにする
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - bigBoss.attackDamage;
        }

        // プレイヤーの攻撃をターミナルに出力
        console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);

        // ボスの攻撃をターミナルに出力
        console.log("Boss attacked player. New player hp: %s\n", player.hp);

        emit AttackComplete(bigBoss.hp, player.hp);
    }


    // === for frontend
    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        uint256 userNftTokenId = nftHolders[msg.sender];

        // ユーザーがすでにtokenIdを持っていたら、そのキャラクターの属性情報を返す
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        // なければ空文字を返す
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }

    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }

}